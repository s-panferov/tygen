import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

let fse = require('fs-extra')

import { Generator } from './generator'
import { Module } from './module'
import { Context } from './context'
import { Package } from './package'

export function compileAndGenerate(target: string = process.cwd()): Context {
	let configFilePath = ts.findConfigFile(target, ts.sys.fileExists)!

	console.log(ts.version)
	const config = ts.parseJsonConfigFileContent(
		JSON.parse(fse.readFileSync(configFilePath)),
		ts.sys,
		'',
		undefined,
		configFilePath
	)

	console.log(JSON.parse(fse.readFileSync(configFilePath)))

	if (config.errors.length > 0) {
		throw new Error(
			`Cannot build project, tsconfig.json errors: ${JSON.stringify(config.errors)}`
		)
	}

	let pkg = Package.fromPath(path.join(target, 'package.js'))
	const generator = generateFiles(config.fileNames, pkg.manifest.name, config.options)

	let context = generator.generate()
	return context
}

export function write(context: Context): Context {
	context.write()
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
			console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
		} else {
			console.error(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
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

export function generateModule(fileName: string, mainPackage: string): Module | undefined {
	return generateFiles([fileName], mainPackage).getModule(fileName)
}
