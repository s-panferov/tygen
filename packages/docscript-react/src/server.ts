import * as fs from 'fs'
import * as path from 'path'

const micro = require('micro')

import { IncomingMessage } from 'http'
import { renderHTML } from './html'

const baseFolder = path.resolve(process.cwd(), process.env.DOCS || 'docs')
const client = path.resolve(__dirname, 'client.js')

console.log('BASE FOLDER', baseFolder)
console.log('CLIENT', client)

const server = micro((req: IncomingMessage) => {
	let url = req.url

	if (!url) {
		return
	}

	console.log('URL', url)

	if (url.startsWith('/-/client.js')) {
		return fs.readFileSync(client)
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
