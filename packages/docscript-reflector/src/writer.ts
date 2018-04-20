import { Context } from './context'
import * as fse from 'fs-extra'
import * as path from 'path'

import * as CircularJSON from 'circular-json'
import { ReflectionKind } from './reflection/reflection'

const IsWritable: { [name: string]: boolean } = {
	[ReflectionKind.Class]: true,
	[ReflectionKind.Enum]: true,
	[ReflectionKind.Function]: true,
	[ReflectionKind.Interface]: true,
	[ReflectionKind.ESModule]: true,
	[ReflectionKind.Variable]: true,
	[ReflectionKind.TypeAlias]: true
}

export class Writer {
	context: Context
	outDir: string

	constructor(context: Context, outDir?: string) {
		this.context = context
		if (!outDir) {
			outDir = path.join(process.cwd(), 'docs')
		}

		fse.mkdirpSync(outDir)
		this.outDir = outDir
	}

	write() {
		this.context.reflectionById.forEach(reflection => {
			if (!IsWritable[reflection.kind]) {
				return
			}

			let folder = path.join(this.outDir, reflection.id!)
			let fileName = path.join(folder, 'index.json')

			fse.mkdirpSync(folder)
			fse.writeFileSync(fileName, CircularJSON.stringify(reflection, null, 4))
		})
	}
}
