import * as fs from 'fs'
import * as path from 'path'

import { IncomingMessage, ServerResponse } from 'http'
import { renderHTML } from './index'

const baseFolder = path.join(process.cwd(), process.env.DOCS || 'docs')

export default function server(req: IncomingMessage) {
	let url = req.url!

	if (url) {
		// TODO security

		let fullPath = path.join(baseFolder, url, 'index.json')
		console.log(fullPath)

		if (fs.existsSync(fullPath)) {
			let content = fs.readFileSync(fullPath).toString()
			return renderHTML(JSON.parse(content), url)
		} else {
			throw new Error(`File not found: ${url}`)
		}
	}
}
