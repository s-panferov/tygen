import * as fse from 'fs-extra'
import * as path from 'path'
import * as ts from 'typescript'

import { parse } from 'tsconfig'
import { generateFiles } from './helpers'
import { Context } from './context'

const testRoot = path.resolve(__dirname, '..', '.test')
fse.mkdirpSync(testRoot)

export function file(name: string, content: string) {
	let fileName = path.join(testRoot, name)
	fse.mkdirpSync(path.dirname(fileName))
	fse.writeFileSync(fileName, content)

	return {
		fileName
	}
}

export function tsconfig() {
	file(
		'tsconfig.json',
		`
		{
			"compilerOptions": {
				"modules": "node",
				"target": "esnext",
				"skipDefaultLibCheck": false,
				"skipLibCheck": false,
				"strict": true,
				"typeRoots" : ["node_modules/@types"]
			},
			"include": [
				"src/**/*"
			]
		}
	`
	)
}

export function packageJson() {
	file(
		'package.json',
		`
		{
			"name": "test-package",
			"version": "1.0.0"
		}
	`
	)
}

export function defaultSetup() {
	tsconfig()
	packageJson()
}

export function clear() {
	fse.removeSync(testRoot)
	fse.mkdirpSync(testRoot)
}

export function compile(): Context {
	let configFilePath = ts.findConfigFile(testRoot, ts.sys.fileExists)!
	const config = ts.parseJsonConfigFileContent(
		fse.readFileSync(configFilePath),
		ts.sys,
		testRoot,
		undefined,
		configFilePath
	)

	const generator = generateFiles(config.fileNames, 'test-package', config.options)
	return generator.generate()
}
