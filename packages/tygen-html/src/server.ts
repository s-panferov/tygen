import path from 'path'
import fs from 'fs'

const mime = require('mime-types')

import { IncomingMessage, ServerResponse } from 'http'
import { renderHTML } from './html'
import { ReactConverterSettings } from './settings'

const favicon = require('../asset/favicon.ico') as string
const ASSETS = '/-/assets/'

export function serverRequest(
	settings: Partial<ReactConverterSettings>,
	req: IncomingMessage,
	res: ServerResponse
) {
	const baseFolder = path.resolve(process.cwd(), process.env.DOCS || 'docs')

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
			const content = fs.readFileSync(indexPath).toString()
			res.setHeader('Content-Type', 'text/html; charset=utf-8')
			return renderHTML(JSON.parse(content), settings)
		} else {
			throw new Error(`File not found: ${url}`)
		}
	}
}
