/// <reference types="webpack-env" />

require('source-map-support').install()

import minimist from 'minimist'

import { serverRequest } from './server'
import { ReactConverter } from './converter'
import { run } from 'micro'
import { Server } from 'http'

export { ReactConverter }
export default (argv: any) => new ReactConverter(argv)

const argv = minimist(process.argv.slice(2))

if (argv.server) {
	let obj = { handler: serverRequest.bind(null, argv) }
	const requestListener = (req: any, res: any) => run(req, res, obj.handler)
	const server = new Server(requestListener).listen(3000)

	console.log('Started...', {
		hot: !!module.hot
	})

	if (module.hot) {
		module.hot.accept(['./server', './converter'], function() {
			const { serverRequest } = require('./server')
			obj.handler = serverRequest.bind(null, argv)
			console.log('Server handler replaced')
		})
	}
}
