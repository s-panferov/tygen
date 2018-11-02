import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

import { Package } from './package'

import log from 'roarr'
import { Generator, Writer } from './runtime'
import { PackageJson } from './reflection'

const { Volume } = require('memfs')

export type FileSystem = typeof fs & { mkdirpSync: (path: string) => void }
export function createMemoryFileSystem(): FileSystem {
	return Volume.fromJSON({}) as any
}

export interface FolderCompilationResult {
	pkg: Package
	result: CompilationResult
}

export function getMainFile(pkg: PackageJson): string | undefined {
	return pkg.typings || pkg.types || (pkg.main && pkg.main.endsWith('.ts') ? pkg.main : undefined)
}

export function compileFolder(target: string = process.cwd()): FolderCompilationResult {
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
		const pkg: PackageJson = JSON.parse(fs.readFileSync(packageFilePath).toString())
		const decl = getMainFile(pkg)

		if (decl) {
			config = ts.parseJsonConfigFileContent(
				{
					files: [decl],
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
	const result = compile(
		config.fileNames,
		Object.assign({}, config.options, {
			target: ts.ScriptTarget.Latest,
			allowJs: true,
			noEmit: true
		})
	)

	return {
		result,
		pkg
	}
}

export function reflectToMemory(project: string) {
	const { result } = compileFolder(project)

	if (!result.success) {
		result.diagnostics.forEach(d => console.error(d.formatted))
		throw new Error(`Project ${project} compilation failed`)
	}

	const generator = new Generator({}, result.program)
	const context = generator.generate()
	const fileSystem = createMemoryFileSystem()
	const writer = new Writer(context, {
		outDir: '/',
		fileSystem: fileSystem
	})
	writer.writeReflections()

	return fileSystem
}

export type CompilationResult =
	| {
			success: true
			program: ts.Program
	  }
	| {
			success: false
			program: ts.Program
			diagnostics: ReflectorDiagnostics[]
	  }

export interface ReflectorDiagnostics {
	diagnostic: ts.Diagnostic
	formatted: string
}

export function compile(fileNames: string[], options: ts.CompilerOptions): CompilationResult {
	const host = ts.createCompilerHost(options, true)
	const program = ts.createProgram(fileNames, options, host)
	const diagnostics: ReflectorDiagnostics[] = ts
		.getPreEmitDiagnostics(program)
		.map(diagnostic => {
			return {
				diagnostic,
				formatted: ts.formatDiagnostic(diagnostic, host)
			}
		})

	if (diagnostics.length > 0) {
		return {
			success: false,
			program,
			diagnostics
		}
	} else {
		return {
			success: true,
			program
		}
	}
}
