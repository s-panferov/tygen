import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

import { Generator } from './generator'
import { SourceFileMeta } from './file'
import { Context } from './context'
import { Package } from './package'

import log from 'roarr'

export function compileFolder(target: string = process.cwd()): Context {
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
	const generator = generateFiles(config.fileNames, pkg.manifest.name, config.options)

	const context = generator.generate()
	return context
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

export function generateFiles(
	fileNames: string[],
	packageName: string,
	opts?: ts.CompilerOptions
): Generator {
	let program = compile(
		fileNames,
		Object.assign({}, opts, {
			target: ts.ScriptTarget.Latest,
			allowJs: true,
			noEmit: true
		})
	)

	let generator = new Generator(packageName, program)

	return generator
}

export function generateFile(fileName: string, mainPackage: string): SourceFileMeta | undefined {
	return generateFiles([fileName], mainPackage).getFile(fileName)
}

export function mkdirSyncP(location: string) {
	let normalizedPath = path.normalize(location)
	let parsedPathObj = path.parse(normalizedPath)
	let curDir = parsedPathObj.root
	let folders = parsedPathObj.dir.split(path.sep)
	folders.push(parsedPathObj.base)
	for (let part of folders) {
		curDir = path.join(curDir, part)
		if (!fs.existsSync(curDir)) {
			fs.mkdirSync(curDir)
		}
	}
}
