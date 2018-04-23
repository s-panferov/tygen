import yc from 'yargs'
import * as yargs from 'yargs'
import { compileAndGenerate } from './helpers'
import { ReflectionWalker } from './walker'

require('source-map-support').install()

function createYargs(): yargs.Argv {
	const y = yc(process.argv.slice(2))
	;(y as any).$0 = 'docscript'
	return y
}

let generate: yargs.CommandModule = {
	command: 'generate [target]',
	describe: 'Generate reflections for project files',
	builder: yargs =>
		yargs
			.positional('target', { type: 'string' })
			.option('out', { type: 'string', default: 'docs' })
			.option('with', { type: 'string' }),
	handler: argv => {
		compileAndGenerate(argv.target).write(argv.out)

		if (argv.with) {
			let converter = require(argv.with)
			if (typeof converter.default !== 'undefined') {
				converter = converter.default
			}

			let visitor = new ReflectionWalker(argv.out)
			visitor.walk(converter)
		}

		console.log('Completed!')
	}
}

let y = createYargs()
	.command(generate)
	// .command({
	// 	command: '*',
	// 	builder: y => y.demandOption('test'),
	// 	handler: () => {
	// 		throw new Error('Command not found')
	// 	}
	// })
	.help()
	.demandCommand(1)
	.showHelpOnFail(true)

y.parse()
