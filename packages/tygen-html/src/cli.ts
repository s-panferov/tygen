/// <reference types="webpack-env" />

require('source-map-support').install()

import yargs from 'yargs'
import { run } from 'micro'
import { Server } from 'http'

import { serverRequest } from './server'
import { args, manifest, reactConverterFactory } from './converter'
export { ReactConverterSettings } from './settings'
export { renderHTML } from './html'

export default reactConverterFactory

if (process.mainModule && process.mainModule!.filename === __filename) {
	args(yargs).command(
		'server',
		'Start a simple serving server',
		yargs => yargs,
		argv => {
			argv = { ...argv, manifest }
			const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
			const obj = { handler: serverRequest.bind(null, argv) }
			const requestListener = (req: any, res: any) => run(req, res, obj.handler)
			const server = new Server(requestListener).listen(PORT)
			;(global as any).server = server

			console.log('Started...')

			if (module.hot) {
				module.hot.accept(['./server', './converter'], function() {
					const { serverRequest } = require('./server')
					obj.handler = serverRequest.bind(null, argv)
					console.log('Server handler replaced')
				})
			}
		}
	).argv
}
