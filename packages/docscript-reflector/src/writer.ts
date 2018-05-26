import { Context } from './context'
import * as fs from 'fs'
import * as path from 'path'

import { ReflectionKind } from './reflection/reflection'
import { mkdirSyncP } from './helpers'
import { SearchReflection } from './reflection/search/reflection'

const IsWritable: { [name: string]: boolean } = {
	[ReflectionKind.Class]: true,
	[ReflectionKind.Enum]: true,
	[ReflectionKind.Function]: true,
	[ReflectionKind.Interface]: true,
	[ReflectionKind.ESModule]: true,
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

	constructor(context: Context, outDir?: string) {
		this.context = context
		if (!outDir) {
			outDir = path.join(process.cwd(), 'docs')
		}

		mkdirSyncP(outDir)
		this.outDir = outDir
	}

	write() {
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

			let folder = path.join(this.outDir, reflection.id!.replace(/->|::/g, path.sep))
			let fileName = path.join(folder, 'index.json')

			mkdirSyncP(folder)
			fs.writeFileSync(fileName, JSON.stringify(reflection, null, 4))
		})

		const searchDir = path.join(this.outDir, '_search')
		if (!fs.existsSync(searchDir)) {
			fs.mkdirSync(searchDir)
		}

		fs.writeFileSync(path.join(searchDir, 'index.json'), JSON.stringify(search))
	}
}
