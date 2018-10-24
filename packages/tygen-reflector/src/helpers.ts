import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

import { Package } from './package'

import log from 'roarr'
import { Generator, Writer } from './runtime'

const { Volume } = require('memfs')

export type FileSystem = typeof fs & { mkdirpSync: (path: string) => void }
export function createMemoryFileSystem(): FileSystem {
	return Volume.fromJSON({}) as any
}

export function compileFolder(target: string = process.cwd()) {
	log.info(`Using TypeScript ${ts.version}`)

	let packageFilePath: string | undefined
	let configFilePath: string | undefined

	if (target.includes('package.json')) {
		packageFilePath = target
	} else if (target.includes('.json')) {
		configFilePath = target
	} else {
		const maybeTsconfig = path.join(target, 'tsconfig.json')
		if (fs.existsSync(maybeTsconfig)) {
			configFilePath = maybeTsconfig
		}

		const maybePackageJson = path.join(target, 'package.json')
		if (fs.existsSync(maybePackageJson)) {
			packageFilePath = maybePackageJson
		}
	}

	let config: ts.ParsedCommandLine | undefined

	if (configFilePath) {
		const jsonConfig = ts.readJsonConfigFile(configFilePath, ts.sys.readFile)
		config = ts.parseJsonSourceFileConfigFileContent(
			jsonConfig,
			ts.sys,
			'.',
			undefined,
			configFilePath
		)
	} else if (packageFilePath) {
		const pkg = JSON.parse(fs.readFileSync(packageFilePath).toString())
		if (pkg.typings) {
			config = ts.parseJsonConfigFileContent(
				{
					files: [pkg.typings],
					compilerOptions: {
						moduleResolution: 'node',
						target: 'esnext',
						strict: true
					}
				},
				ts.sys,
				'.',
				undefined,
				packageFilePath
			)
		}
	}

	if (!config) {
		throw new Error('Nothing to compile')
	}

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

export function reflectToMemory(project: string) {
	const { program } = compileFolder(project)
	const generator = new Generator({}, program)
	const context = generator.generate()
	const fileSystem = createMemoryFileSystem()
	const writer = new Writer(context, {
		outDir: '/',
		fileSystem: fileSystem
	})
	writer.writeReflections()

	return fileSystem
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
