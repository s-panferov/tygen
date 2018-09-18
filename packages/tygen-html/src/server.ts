import * as fs from 'fs'
import * as path from 'path'

import { Converter, Reflection, ReflectionWalker } from '@tygen/reflector'
import { ReactConverterSettings } from './settings'

const micro = require('micro')
const mime = require('mime-types')

import minimist from 'minimist'

import { IncomingMessage, ServerResponse } from 'http'
import { renderHTML } from './html'

const baseFolder = path.resolve(process.cwd(), process.env.DOCS || 'docs')
const client = path.resolve(__dirname, 'client.js')

console.log('BASE FOLDER', baseFolder)
console.log('CLIENT', client)

const favicon = require('../asset/favicon.ico') as string
const ASSETS = '/-/assets/'

const argv = minimist(process.argv.slice(2)) as any

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!', argv)

if (argv.server) {
	const server = micro((req: IncomingMessage, res: ServerResponse) => {
		let url = req.url

		if (!url) {
			return
		}

		url = decodeURIComponent(url)

		if (url.startsWith('/favicon.ico')) {
			url = favicon
		}

		if (url.startsWith(ASSETS)) {
			const filePath = path.join(__dirname, url.slice(ASSETS.length))
			res.setHeader('Content-Type', mime.contentType(path.extname(filePath)))
			return fs.readFileSync(filePath)
		}

		const urlPath = path.join(baseFolder, url)

		if (fs.existsSync(urlPath) && fs.statSync(urlPath).isFile()) {
			return fs.readFileSync(urlPath)
		} else {
			let indexPath = path.join(baseFolder, url, 'index.json')
			if (fs.existsSync(indexPath)) {
				let content = fs.readFileSync(indexPath).toString()
				return renderHTML(JSON.parse(content), url, argv)
			} else {
				throw new Error(`File not found: ${url}`)
			}
		}
	})

	server.listen(3000)
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
