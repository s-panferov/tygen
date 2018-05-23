import minimist from 'minimist'
import { compileAndGenerate } from './helpers'
import { ReflectionWalker } from './walker'
import { updateInventory } from './reflection/inventory'
import { ConverterFactory } from './converter'

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
		if (!argv.out) {
			argv.out === 'docs'
		}

		compileAndGenerate(target).write(argv.out)
		updateInventory(argv.out)

		if (argv.with) {
			let converterFactory: ConverterFactory = require(argv.with)
			if (typeof (converterFactory as any).default !== 'undefined') {
				converterFactory = (converterFactory as any).default
			}

			const converter = converterFactory(argv)

			let visitor = new ReflectionWalker(argv.out)
			visitor.walk(converter)
		}

		console.log('Completed!')
	}
}
