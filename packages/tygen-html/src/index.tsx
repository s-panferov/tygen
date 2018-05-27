import path from 'path'
import fs from 'fs'

import { Converter, Reflection, ReflectionWalker } from '@tygen/reflector'
import { renderHTML } from './html'
import { ReactConverterSettings } from './settings'

import './client'

export class ReactConverter implements Converter {
	options: ReactConverterSettings

	constructor(options: ReactConverterSettings) {
		this.options = options
	}

	visitReflection(ref: Reflection, fileName: string, _visitor: ReflectionWalker) {
		const fileNameWithoutExt = path.basename(fileName, path.extname(fileName))
		return [
			{
				content: renderHTML(ref, fileName, Object.assign({ static: true }, this.options)),
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
			extra.fs.copyFileSync(path.join(runtimeDir, item), path.join(assetsDir, item))
		})

		return undefined
	}
}

export default (argv: any) => new ReactConverter(argv)
