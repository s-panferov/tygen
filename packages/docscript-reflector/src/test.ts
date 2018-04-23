import * as fse from 'fs-extra'
import * as path from 'path'

import { compileAndGenerate } from './helpers'

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
				"strictNullChecks": true,
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

export function compile() {
	return compileAndGenerate(testRoot).write(path.join(testRoot, 'docs'))
}

export function defaultSetup() {
	tsconfig()
	packageJson()
}

export function clear() {
	fse.removeSync(testRoot)
	fse.mkdirpSync(testRoot)
}
