import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

let fse = require('fs-extra')

import { Generator } from './generator'
import { Module } from './module'

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
