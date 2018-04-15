import { Context } from './context'
import * as fse from 'fs-extra'
import * as path from 'path'

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
			let folder = path.join(this.outDir, reflection.id!)
			let fileName = path.join(folder, 'index.json')

			fse.mkdirpSync(folder)
			fse.writeFileSync(fileName, JSON.stringify(reflection, null, 4))
		})
	}
}
