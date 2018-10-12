import * as ts from 'typescript'

import { Package } from './package'
import { SourceFileMeta } from './file'
import { Context } from './context'

import log from 'roarr'
import { Options } from './options'

export class Generator {
	program: ts.Program
	options: Options

	packages = new Map<string, Package>()
	files = new Map<string, SourceFileMeta>()

	constructor(options: Options, program: ts.Program) {
		this.program = program
		this.options = options

		let sourceFiles = this.program.getSourceFiles()

		log.trace({ fileNames: sourceFiles.map(s => s.fileName) }, 'Documentation scope')

		sourceFiles.forEach(sourceFile => {
			this.addFile(sourceFile)
		})
	}

	shouldFileBeIncluded(sourceFile: ts.SourceFile) {
		if (!this.options.includeLibs && this.program.isSourceFileDefaultLibrary(sourceFile)) {
			return false
		}

		if (!this.options.includeTypes && sourceFile.fileName.includes('@types/')) {
			return false
		}

		return true
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

		let mod = new SourceFileMeta(pack, sourceFile, this.shouldFileBeIncluded(sourceFile))

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
		Array.from(this.packages.values())
			.filter(pkg => Array.from(pkg.files.values()).some(file => file.included))
			.forEach(pkg => {
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
				pkg.generate(context)
			})

		// TODO
		// context.registerRelatedModules()
		return context
	}
}
