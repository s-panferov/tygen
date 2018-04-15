import * as ts from 'typescript'

import { Package } from './package'
import { Module } from './module'
import { Context } from './context'

export class Generator {
	packageName: string
	program: ts.Program

	packages = new Map<string, Package>()
	modules = new Map<string, Module>()

	constructor(packageName: string, program: ts.Program) {
		this.packageName = packageName
		this.program = program
		this.program.getSourceFiles().forEach(sourceFile => this.addModule(sourceFile))
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

		pack.modules.set(sourceFile.fileName, mod)
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
			// if (pkg.manifest.name === this.packageName) {
			pkg.modules.forEach(mod => {
				mod.generate(context)
			})
			// }
		})

		context.registerRelatedModules()

		return context
	}
}
