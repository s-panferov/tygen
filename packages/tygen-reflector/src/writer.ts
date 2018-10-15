import { Context } from './context'
import * as fse from 'fs-extra'
import * as ts from 'typescript'
import * as path from 'path'

import { ReflectionKind } from './reflection/reflection'
import { FileSystem } from './helpers'
import { SearchReflection } from './reflection/search/reflection'
import { stringifyId, idFromPath } from './reflection/identifier'
import { ExcludedFlag, ExcludedReflection } from './reflection/utils'

const IsWritable: { [name: string]: boolean } = {
	[ReflectionKind.Class]: true,
	[ReflectionKind.Enum]: true,
	[ReflectionKind.Function]: true,
	[ReflectionKind.Interface]: true,
	[ReflectionKind.ESModule]: true,
	[ReflectionKind.AmbientFile]: true,
	[ReflectionKind.Module]: true,
	[ReflectionKind.Namespace]: true,
	[ReflectionKind.Variable]: true,
	[ReflectionKind.TypeAlias]: true,
	[ReflectionKind.Package]: true,
	[ReflectionKind.Folder]: true
}

const IsSearchable: { [name: string]: boolean } = Object.assign({}, IsWritable, {
	[ReflectionKind.Property]: true,
	[ReflectionKind.Method]: true,
	[ReflectionKind.EnumMember]: true
})

export class Writer {
	context: Context
	outDir: string
	fs: FileSystem

	constructor(context: Context, outDir?: string, fsImpl: FileSystem = fse as any) {
		this.context = context
		if (!outDir) {
			outDir = path.join(process.cwd(), 'docs')
		}

		this.fs = fsImpl
		this.fs.mkdirpSync(outDir)
		this.outDir = outDir
	}

	writeReflections() {
		let search: SearchReflection
		const searchDir = path.join(this.outDir, '_search')
		const searchFile = path.join(searchDir, 'index.json')
		if (!this.fs.existsSync(searchDir)) {
			this.fs.mkdirSync(searchDir)
		}

		if (!this.fs.existsSync(searchFile)) {
			search = {
				kind: ReflectionKind.Search,
				packages: {}
			}
		} else {
			search = JSON.parse(fse.readFileSync(searchFile).toString())
		}

		const updatedSearchPackages: { [key: string]: boolean } = {}

		this.context.reflectionById.forEach(reflection => {
			if ((reflection as ExcludedReflection)[ExcludedFlag]) {
				return
			}

			if (
				IsSearchable[reflection.kind] &&
				reflection.id &&
				// Make only top-level items searchable
				reflection.id.every(id => IsSearchable[id.kind])
			) {
				const packageKey = `${reflection.id[0].name}@${reflection.id[0].version}`
				if (!search.packages[packageKey] || !updatedSearchPackages[packageKey]) {
					search.packages[packageKey] = []
					updatedSearchPackages[packageKey] = true
				}
				search.packages[packageKey].push(idFromPath(reflection.id))
			}

			if (!IsWritable[reflection.kind]) {
				return
			}

			const folder = path.join(this.outDir, stringifyId(reflection.id!))
			const fileName = path.join(folder, 'index.json')

			this.fs.mkdirpSync(folder)
			this.fs.writeFileSync(fileName, JSON.stringify(reflection, null, 4))
		})

		this.fs.writeFileSync(searchFile, JSON.stringify(search))
	}

	writeSources() {
		const sourcesDir = path.join(this.outDir, '_sources')
		this.fs.mkdirpSync(sourcesDir)

		const sourceFiles = this.context.program.getSourceFiles()
		const serialized: SerializedProgram = {
			tsconfig: {
				compilerOptions: this.context.program.getCompilerOptions()
			},
			files: createObject(sourceFiles, sourceFile => {
				return [sourceFile.fileName, { content: sourceFile.getText() }]
			})
		}

		this.fs.writeFileSync(path.join(sourcesDir, 'index.json'), JSON.stringify(serialized))
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
