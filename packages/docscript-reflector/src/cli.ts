import minimist from 'minimist'
import { compileAndGenerate } from './helpers'
import { ReflectionWalker } from './walker'

const argv = minimist(process.argv.slice(2))

export interface Argv {
	target: string
	out?: string
	with?: string
}

const command = argv._[0]

switch (command) {
	case 'generate': {
		const target = argv._[1]
		compileAndGenerate(target).write(argv.out)

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
