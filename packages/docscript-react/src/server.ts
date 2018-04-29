import * as fs from 'fs'
import * as path from 'path'

const micro = require('micro')

import { IncomingMessage } from 'http'
import { renderHTML } from './html'

const baseFolder = path.resolve(process.cwd(), process.env.DOCS || 'docs')
const client = path.resolve(__dirname, 'client.js')

console.log('BASE FOLDER', baseFolder)
console.log('CLIENT', client)

const favicon = require('../asset/favicon.ico')

const server = micro((req: IncomingMessage) => {
	let url = req.url

	if (!url) {
		return
	}

	url = decodeURIComponent(url)

	if (url.startsWith('/-/client.js')) {
		return fs.readFileSync(client)
	}

	if (url.startsWith('/favicon.ico')) {
		return fs.readFileSync(path.join(__dirname, favicon))
	}

	let urlPath = path.join(baseFolder, url)

	if (fs.existsSync(urlPath) && fs.statSync(urlPath).isFile()) {
		return fs.readFileSync(urlPath)
	} else {
		let indexPath = path.join(baseFolder, url, 'index.json')
		if (fs.existsSync(indexPath)) {
			let content = fs.readFileSync(indexPath).toString()
			return renderHTML(JSON.parse(content), url)
		} else {
			throw new Error(`File not found: ${url}`)
		}
	}
})

server.listen(3000)
