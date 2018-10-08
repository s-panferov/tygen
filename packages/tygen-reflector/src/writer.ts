import { Context } from './context'
import * as fse from 'fs-extra'
import * as ts from 'typescript'
import * as path from 'path'

import { ReflectionKind } from './reflection/reflection'
import { FileSystem } from './helpers'
import { SearchReflection } from './reflection/search/reflection'
import { stringifyId } from './reflection/identifier'

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
	[ReflectionKind.EnumMember]: true,
	[ReflectionKind.Parameter]: true
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
		const search: SearchReflection = {
			kind: ReflectionKind.Search,
			items: []
		}

		this.context.reflectionById.forEach(reflection => {
			if (IsSearchable[reflection.kind] && reflection.id) {
				search.items.push(reflection.id)
			}

			if (!IsWritable[reflection.kind]) {
				return
			}

			let folder = path.join(this.outDir, stringifyId(reflection.id!))
			let fileName = path.join(folder, 'index.json')

			this.fs.mkdirpSync(folder)
			this.fs.writeFileSync(fileName, JSON.stringify(reflection, null, 4))
		})

		const searchDir = path.join(this.outDir, '_search')
		if (!this.fs.existsSync(searchDir)) {
			this.fs.mkdirSync(searchDir)
		}

		this.fs.writeFileSync(path.join(searchDir, 'index.json'), JSON.stringify(search))
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
