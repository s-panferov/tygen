import * as ts from 'typescript'

import { Package } from './package'
import { Module } from './module'
import { Context } from './context'

import log from 'roarr'

export class Generator {
	packageName: string
	program: ts.Program

	packages = new Map<string, Package>()
	modules = new Map<string, Module>()

	constructor(packageName: string, program: ts.Program) {
		this.packageName = packageName
		this.program = program
		let sourceFiles = this.program.getSourceFiles()

		sourceFiles = sourceFiles.filter(sourceFile => {
			// TODO generate types for TypeScript stdlib separately
			if (this.program.isSourceFileDefaultLibrary(sourceFile)) {
				return false
			}

			return true
		})

		log.trace({ fileNames: sourceFiles.map(s => s.fileName) }, 'Documentation scope')

		sourceFiles.forEach(sourceFile => {
			this.addModule(sourceFile)
		})
	}

	addModule(sourceFile: ts.SourceFile): Module {
		let existed = this.modules.get(sourceFile.fileName)
		if (existed) {
			return existed
		}

		let pack = Package.fromPath(sourceFile.fileName, this.packages)
		if (!this.packages.has(pack.folderPath)) {
			this.packages.set(pack.folderPath, pack)
		}

		let mod = new Module(pack, sourceFile)

		pack.addModule(mod)
		this.modules.set(sourceFile.fileName, mod)

		return mod
	}

	getModule(sourceFileName: string): Module | undefined {
		return this.modules.get(sourceFileName)
	}

	generate() {
		let context = new Context(this)

		// generate own modules
		this.packages.forEach(pkg => {
			const packageInfo = {
				name: pkg.manifest.name,
				version: pkg.manifest.version,
				manifest: pkg.manifestFilePath,
				folder: pkg.folderPath
			}

			if (!pkg.manifest.name) {
				log.error(packageInfo, 'Package has no name, skipping')
				return
			}

			if (!pkg.manifest.version) {
				log.error(packageInfo, 'Package has no version, skipping')
				return
			}

			log.info(packageInfo, 'Generate package')

			// if (pkg.manifest.name === this.packageName) {
			pkg.modules.forEach(mod => {
				log.info({ fileName: mod.sourceFile.fileName }, 'Generate module')

				if (mod.sourceFile.isDeclarationFile) {
					if (mod.sourceFile.flags & (ts.NodeFlags as any).Ambient) {
						debugger
					}
				}

				mod.generate(context)
			})

			pkg.generate(context)
			// }
		})

		// TODO
		// context.registerRelatedModules()
		return context
	}
}
