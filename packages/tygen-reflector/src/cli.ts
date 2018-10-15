import yargs from 'yargs'
import fs from 'fs'

import { compileFolder } from './helpers'
import { ReflectionWalker } from './walker'
import { updateInventory } from './reflection/inventory'
import { ConverterFactory } from './converter'
import { Writer } from './writer'

import * as ts from 'typescript'
import { Options } from './options'
import { Generator } from './generator'

require('source-map-support').install()

// @ts-ignore
global.ts = ts

const GenerateCommand: yargs.CommandModule = {
	command: 'generate',
	describe: 'Build documentation',
	builder: yargs => {
		return yargs
			.option('project', {
				alias: 'p',
				description: 'Path to tsconfig.json to compile and generate documentation',
				required: true,
				type: 'string'
			})
			.option('with', {
				alias: 'w',
				description: 'Documentation preprocessor (for HTML, Markdown, etc.)',
				required: false,
				type: 'string'
			})
			.option('out', {
				alias: 'o',
				default: 'docs',
				description: 'Output folder',
				required: false,
				type: 'string'
			})
			.option('include-libs', {
				default: false,
				description: 'Include TypeScript default library declarations',
				required: false,
				type: 'boolean'
			})
			.option('include-types', {
				default: false,
				description: 'Include @types/xxx declarations',
				required: false,
				type: 'boolean'
			})
			.option('always-link', {
				default: false,
				description:
					'If symbol is not included we still emit links to it. You may not want this by default.',
				required: false,
				type: 'boolean'
			})
	},
	handler: defer((argv: Options) => {
		const { program } = compileFolder(argv.project)

		const generator = new Generator(argv, program)
		const context = generator.generate()

		const writer = new Writer(context, argv.out)

		writer.writeReflections()
		writer.writeSources()

		updateInventory(argv.out)

		if (argv.with) {
			const mainFile = require.resolve(argv.with)
			let converterFactory: ConverterFactory = require(argv.with)
			if (typeof (converterFactory as any).default !== 'undefined') {
				converterFactory = (converterFactory as any).default
			}

			const converter = converterFactory(argv)

			let visitor = new ReflectionWalker(argv.out)
			visitor.walk(converter)

			if (converter.emitRuntime) {
				converter.emitRuntime(argv.out, {
					fs: fs,
					main: mainFile
				})
			}
		}

		console.log('Completed!')
		process.exit(0)
	})
}

function defer<T extends Function>(fn: T) {
	return (...args: any[]) => {
		setTimeout(fn.bind(null, ...args), 0)
	}
}

yargs
	.command(GenerateCommand)
	.strict()
	.recommendCommands()
	.demandCommand().argv
