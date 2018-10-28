import { Context } from './context'
import * as fse from 'fs-extra'
import * as ts from 'typescript'
import * as path from 'path'
import { gzipSync } from 'zlib'

import { ReflectionKind, ReflectionWithMetadata } from './reflection/reflection'
import { SearchReflection } from './reflection/search/reflection'
import { stringifyId, idFromPath } from './reflection/identifier'
import { ExcludedFlag, ExcludedReflection } from './reflection/utils'
import { formatVersion } from './version'

export const IsWritable: { [name: string]: boolean } = {
	[ReflectionKind.Class]: true,
	[ReflectionKind.Enum]: true,
	[ReflectionKind.Function]: true,
	[ReflectionKind.Interface]: true,
	[ReflectionKind.ESModule]: true,
	[ReflectionKind.DeclarationFile]: true,
	[ReflectionKind.AmbientModule]: true,
	[ReflectionKind.Namespace]: true,
	[ReflectionKind.Variable]: true,
	[ReflectionKind.TypeAlias]: true,
	[ReflectionKind.Package]: true,
	[ReflectionKind.Folder]: true
}

export const IsSearchable: { [name: string]: boolean } = Object.assign({}, IsWritable, {
	[ReflectionKind.Property]: true,
	[ReflectionKind.Method]: true,
	[ReflectionKind.EnumMember]: true
})

export interface WriterFileSystem {
	existsSync: (path: string) => boolean
	mkdirpSync: (path: string) => void
	writeFileSync: (path: string, content: string | Buffer) => void
}

export interface WriterOptions {
	outDir: string
	fileSystem: WriterFileSystem
	gzip: boolean
	enableSearch: boolean
}

export class Writer {
	context: Context
	options: WriterOptions

	constructor(context: Context, opts: Partial<WriterOptions> = {}) {
		this.options = {
			enableSearch: !!opts.enableSearch,
			outDir: opts.outDir || path.join(process.cwd(), 'docs'),
			fileSystem: opts.fileSystem || ((fse as any) as WriterFileSystem),
			gzip: typeof opts.gzip !== 'undefined' ? opts.gzip : false
		}

		this.context = context
		this.options.fileSystem.mkdirpSync(this.options.outDir)
	}

	writeReflections() {
		let search: SearchReflection
		const { fileSystem, outDir, gzip, enableSearch } = this.options
		const searchDir = path.join(outDir, '_search')
		const searchFile = path.join(searchDir, 'index.json')

		if (enableSearch) {
			if (!fileSystem.existsSync(searchDir)) {
				fileSystem.mkdirpSync(searchDir)
			}

			if (!fileSystem.existsSync(searchFile)) {
				search = {
					kind: ReflectionKind.Search,
					packages: {}
				}
			} else {
				search = JSON.parse(fse.readFileSync(searchFile).toString())
			}
		}

		const alreadyRecreated: { [pkgVersion: string]: boolean } = {}

		this.context.reflectionById.forEach(reflection => {
			if ((reflection as ExcludedReflection)[ExcludedFlag]) {
				return
			}

			if (
				enableSearch &&
				IsSearchable[reflection.kind] &&
				reflection.id &&
				// Make only top-level items searchable
				reflection.id.every(id => IsSearchable[id.kind])
			) {
				const packageKey = `${reflection.id[0].name}#${reflection.id[0].version}`
				if (!search.packages[packageKey] || !alreadyRecreated[packageKey]) {
					search.packages[packageKey] = []
					alreadyRecreated[packageKey] = true
				}

				search.packages[packageKey].push(idFromPath(reflection.id))
			}

			if (!IsWritable[reflection.kind]) {
				return
			}

			const folder = path.join(outDir, stringifyId(reflection.id!))
			const fileName = path.join(folder, 'index.json')

			fileSystem.mkdirpSync(folder)

			const meta: ReflectionWithMetadata = {
				metadata: {
					formatVersion
				},
				reflection
			}

			let fileContent: string | Buffer = JSON.stringify(meta, null, 4)

			if (gzip) {
				fileContent = gzipSync(fileContent, {
					level: 1
				})
			}

			fileSystem.writeFileSync(fileName, fileContent)
		})

		if (enableSearch) {
			fileSystem.writeFileSync(searchFile, JSON.stringify(search!))
			Object.keys(search!.packages).forEach(key => {
				const [pkg, version] = key.split('#')

				// Write individual search reflections
				try {
					fileSystem.writeFileSync(
						path.join(outDir, pkg, version, 'search.json'),
						JSON.stringify({
							kind: ReflectionKind.Search,
							name: 'Search',
							packages: { [key]: search!.packages[key] }
						})
					)
				} catch (e) {
					throw new Error('Package has searchable items, but nothing is included')
				}
			})
		}
	}

	writeSources() {
		const { fileSystem, outDir } = this.options
		const sourcesDir = path.join(outDir, '_sources')
		fileSystem.mkdirpSync(sourcesDir)

		const sourceFiles = this.context.program.getSourceFiles()
		const serialized: SerializedProgram = {
			tsconfig: {
				compilerOptions: this.context.program.getCompilerOptions()
			},
			files: createObject(sourceFiles, sourceFile => {
				return [sourceFile.fileName, { content: sourceFile.getText() }]
			})
		}

		fileSystem.writeFileSync(path.join(sourcesDir, 'index.json'), JSON.stringify(serialized))
		return serialized
	}
}

export interface SerializedProgram {
	tsconfig: {
		compilerOptions: ts.CompilerOptions
	}
	files: { [fileName: string]: { content: string } }
}

export function createObject<T, R>(
	arr: ReadonlyArray<T>,
	key: (item: T) => [string, R]
): { [key: string]: R } {
	const obj = {} as any
	arr.forEach(item => {
		const [k, v] = key(item)
		obj[k] = v
	})

	return obj
}
