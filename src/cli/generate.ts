import * as tsconfig from 'tsconfig'
import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

import { resolveManifestSync } from './manifest'

import { DocWriter } from '../doc/writer'
import * as helpers from '../doc/helpers'

interface GenerateCommand {
	sourceDir: string
	docDir: string
	ui?: string
	deepForeign?: boolean
	withoutSearch?: boolean
}

export const command = 'generate'
export const describe = 'Generate documentation for project'

export const builder = {
	config: {
		alias: '-c',
		default: 'docscript.json',
		describe: 'Path to your .docscript.json file',
	},
	sourceDir: {
		alias: '-d',
		default: '.',
		describe: 'Source directory with your tsconfig.json file',
	},
	mainPackage: {
		alias: '-p',
		describe: 'Main that will be shown in docscript',
	},
	docDir: {
		alias: '-o',
		default: 'doc',
		describe: 'Directory to write output',
	},
	ui: {
		default: path.dirname(fs.realpathSync(__filename)),
		describe: 'Package where compiled docscript UI is located',
	},
	deepForeign: {
		alias: '-f',
		describe: 'Keep all deep links consistent',
	},
	withoutSearch: {
		alias: '-n',
		describe: 'Omit search index generation',
	},
}

export function handler(argv: GenerateCommand) {
	let manifest = resolveManifestSync()
	let tsconfigPath = tsconfig.resolveSync(argv.sourceDir)

	if (!tsconfigPath) {
		throw new Error('Cannot resolve tsconfig.json in sourceDir')
	}

	let { files, compilerOptions } = tsconfig.loadSync(tsconfigPath)

	let tsCompilerOptions = helpers.rawToTsCompilerOptions(compilerOptions, process.cwd(), ts)
	let ctx = helpers.generateFiles(files, manifest.package, tsCompilerOptions)

	ctx.generateForeignModules(argv.deepForeign)

	let writer = new DocWriter(ctx)
	writer.ensureDir(argv.docDir)
	writer.writeModules(path.join(argv.docDir, 'generated'), !argv.withoutSearch)
		.then(() => {
			helpers.copyUI(argv.docDir, argv.ui)
			process.exit(0)
		})
		.catch((e) => {
			console.error(e)
			process.exit(1)
		})
}
