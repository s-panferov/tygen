import { Context } from './context'
import * as fs from 'fs'
import * as path from 'path'

import { ReflectionKind } from './reflection/reflection'
import { mkdirSyncP } from './helpers'

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
		this.context.reflectionById.forEach(reflection => {
			if (!IsWritable[reflection.kind]) {
				return
			}

			let folder = path.join(this.outDir, reflection.id!.replace(/::/g, path.sep))
			let fileName = path.join(folder, 'index.json')

			mkdirSyncP(folder)
			fs.writeFileSync(fileName, JSON.stringify(reflection, null, 4))
		})
	}
}
