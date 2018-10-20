import * as fs from 'fs'
import * as path from 'path'

import { Converter, Reflection, ReflectionWalker } from '@tygen/reflector/runtime'
import { ReactConverterSettings } from './settings'
import { renderHTML } from './html'
import { Argv } from 'yargs'

export const manifest = JSON.parse(
	fs.readFileSync(path.join(__dirname, 'manifest.json')).toString()
)

export const args = (yargs: Argv) => {
	return yargs
		.option('google.analytics.id', {
			type: 'string'
		})
		.option('contextRoot', { required: false, type: 'string' })
}

export class ReactConverter implements Converter {
	options: ReactConverterSettings

	constructor(options: ReactConverterSettings) {
		this.options = options
	}

	visitReflection(ref: Reflection, fileName: string, _visitor: ReflectionWalker) {
		const fileNameWithoutExt = path.basename(fileName, path.extname(fileName))
		return [
			{
				content: renderHTML(ref, Object.assign({ static: true }, this.options)),
				name: `${fileNameWithoutExt}.html`
			}
		]
	}

	emitRuntime(outDir: string, extra: { fs: typeof fs; main: string }) {
		const runtimeDir = path.dirname(extra.main)
		const metaDir = path.join(outDir, '-')
		const assetsDir = path.join(metaDir, 'assets')

		try {
			extra.fs.mkdirSync(metaDir)
			extra.fs.mkdirSync(assetsDir)
		} catch (e) {}

		extra.fs.readdirSync(runtimeDir).forEach(item => {
			if (!item.includes('hot-update')) {
				extra.fs.copyFileSync(path.join(runtimeDir, item), path.join(assetsDir, item))
			}
		})

		return undefined
	}
}

export const reactConverterFactory = (argv: any) => new ReactConverter({ ...argv, manifest })
reactConverterFactory.args = args
export default reactConverterFactory
