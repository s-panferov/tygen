/// <reference types="webpack-env" />

require('source-map-support').install()

import minimist from 'minimist'

import { serverRequest } from './server'
import { ReactConverter } from './converter'
import micro from 'micro'

export { ReactConverter }
export default (argv: any) => new ReactConverter(argv)

const argv = minimist(process.argv.slice(2))

if (argv.server) {
	micro(serverRequest.bind(null, argv)).listen(3000)
}
