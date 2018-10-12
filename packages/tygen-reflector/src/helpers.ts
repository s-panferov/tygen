import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

import { Package } from './package'

import log from 'roarr'

const { Volume } = require('memfs')

export type FileSystem = typeof fs & { mkdirpSync: (path: string) => void }
export function createMemoryFileSystem(): FileSystem {
	return Volume.fromJSON({}) as any
}

export function compileFolder(target: string = process.cwd()) {
	const absolutePath = path.resolve(process.cwd(), target)
	const configFilePath = ts.findConfigFile(absolutePath, ts.sys.fileExists)!

	log.info(`Using TypeScript ${ts.version}`)

	const jsonConfig = ts.readJsonConfigFile(configFilePath, ts.sys.readFile)
	const config = ts.parseJsonSourceFileConfigFileContent(
		jsonConfig,
		ts.sys,
		absolutePath,
		undefined,
		configFilePath
	)

	if (config.errors.length > 0) {
		log.error({ errors: config.errors }, `Cannot build project, tsconfig.json has errors`)
		throw new Error(``)
	}

	log.trace({ fileNames: config.fileNames }, 'Initial project files')

	const pkg = Package.fromPath(path.join(target, 'package.js'))
	const program = compile(
		config.fileNames,
		Object.assign({}, config.options, {
			target: ts.ScriptTarget.Latest,
			allowJs: true,
			noEmit: true
		})
	)

	return {
		program,
		pkg
	}
}

export function compile(fileNames: string[], options: ts.CompilerOptions): ts.Program {
	let program = ts.createProgram(fileNames, options)
	let allDiagnostics = ts.getPreEmitDiagnostics(program)

	allDiagnostics.forEach(diagnostic => {
		if (diagnostic.file) {
			let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
				diagnostic.start!
			)
			let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
			log.error(
				{ fileName: diagnostic.file.fileName, line: line + 1, character: character + 1 },
				message
			)
		} else {
			log.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
		}
	})

	if (allDiagnostics.length > 0) {
		throw new Error('Refuse to generate documentation due to compilation errors.')
	}

	return program
}
