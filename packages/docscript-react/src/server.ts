import * as fs from 'fs'
import * as path from 'path'

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

	let urlPath = path.join(baseFolder, url)

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
