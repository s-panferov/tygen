import * as ts from 'typescript'

import { Package } from './package'
import { SourceFileMeta } from './file'
import { Context } from './context'

import log from 'roarr'

export class Generator {
	packageName: string
	program: ts.Program

	packages = new Map<string, Package>()
	files = new Map<string, SourceFileMeta>()

	constructor(packageName: string, program: ts.Program) {
		this.packageName = packageName
		this.program = program
		let sourceFiles = this.program.getSourceFiles()

		log.trace({ fileNames: sourceFiles.map(s => s.fileName) }, 'Documentation scope')

		sourceFiles.forEach(sourceFile => {
			this.addFile(sourceFile)
		})
	}

	addFile(sourceFile: ts.SourceFile): SourceFileMeta {
		let existed = this.files.get(sourceFile.fileName)
		if (existed) {
			return existed
		}

		let pack = Package.fromPath(sourceFile.fileName, this.packages)
		if (!this.packages.has(pack.folderPath)) {
			this.packages.set(pack.folderPath, pack)
		}

		let mod = new SourceFileMeta(pack, sourceFile)

		pack.addFile(mod)
		this.files.set(sourceFile.fileName, mod)

		return mod
	}

	getFile(sourceFileName: string): SourceFileMeta | undefined {
		return this.files.get(sourceFileName)
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

			const files = Array.from(pkg.files.values()).filter(file => {
				return !context.program.isSourceFileDefaultLibrary(file.sourceFile)
			})

			if (files.length > 0) {
				files.forEach(file => {
					log.info({ fileName: file.sourceFile.fileName }, 'Generate module')
					file.generate(context)
				})

				pkg.generate(context)
			}
		})

		// TODO
		// context.registerRelatedModules()
		return context
	}
}
