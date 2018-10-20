import yargs from 'yargs'
import fs from 'fs'

import { compileFolder } from './helpers'
import { ReflectionWalker } from './walker'
import { updateInventory } from './reflection/inventory'
import { ConverterFactory } from './converter'
import { Writer } from './writer'

import * as ts from 'typescript'
import { Generator, GeneratorOptions } from './generator'

const Yargs = require('yargs/yargs')

require('source-map-support').install()

// @ts-ignore
global.ts = ts

export interface ReflectOptions extends GeneratorOptions {
	project: string
	out: string
}

export interface GenerateOptions {
	out: string
	with: string
}

const ReflectCommand: yargs.CommandModule = {
	command: 'reflect',
	describe: 'Build reflections',
	builder: yargs => {
		return yargs
			.option('project', {
				alias: 'p',
				description: 'Path to tsconfig.json to compile and generate documentation',
				required: true,
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
	handler: defer((argv: ReflectOptions) => {
		const { program } = compileFolder(argv.project)

		const generator = new Generator(argv, program)
		const context = generator.generate()

		const writer = new Writer(context, argv.out)

		writer.writeReflections()
		writer.writeSources()

		updateInventory(argv.out)

		console.log('Completed!')
		process.exit(0)
	})
}

const GenerateCommand: yargs.CommandModule = {
	command: 'generate',
	describe: 'Build pre-generated documentation from reflections',
	builder: args => {
		// First-pass parser
		const argv = Yargs(process.argv.slice(2))
			.help(false)
			.parse()

		let yargsSpec = args
			.option('out', {
				alias: 'o',
				default: 'docs',
				description: 'Output folder',
				required: false,
				type: 'string'
			})
			.option('with', {
				alias: 'w',
				description: 'Documentation preprocessor (for HTML, Markdown, etc.)',
				required: true,
				type: 'string'
			})

		try {
			const factory = loadFactory(argv.with)
			if (factory && factory.args) {
				yargsSpec = factory.args(yargsSpec)
			}
		} catch (e) {}

		return yargsSpec
	},
	handler: defer((argv: GenerateOptions) => {
		const mainFile = require.resolve(argv.with)
		const converterFactory = loadFactory(argv.with)
		const converter = converterFactory(argv)

		let visitor = new ReflectionWalker(argv.out)
		visitor.walk(converter)

		if (converter.emitRuntime) {
			converter.emitRuntime(argv.out, {
				fs: fs,
				main: mainFile
			})
		}

		console.log('Completed!')
		process.exit(0)
	})
}

export function loadFactory(spec: string) {
	let converterFactory: ConverterFactory = require(spec)
	if (typeof (converterFactory as any).default !== 'undefined') {
		converterFactory = (converterFactory as any).default
	}

	return converterFactory
}

function defer<T extends Function>(fn: T) {
	return (...args: any[]) => {
		setTimeout(fn.bind(null, ...args), 0)
	}
}

yargs
	.command(ReflectCommand)
	.command(GenerateCommand)
	.strict()
	.recommendCommands()
	.demandCommand().argv
