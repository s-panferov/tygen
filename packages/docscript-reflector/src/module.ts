import ts from 'typescript'
import path from 'path'

import { Package } from './package'
import { Context } from './context'

import { visitSourceFile, ESModuleReflection } from './reflection/module'

export class Module {
	sourceFile: ts.SourceFile
	pkg: Package
	pathInfo: PathInfo

	reflection!: ESModuleReflection

	constructor(pkg: Package, sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile as ts.SourceFile
		this.pkg = pkg
		this.pathInfo = getPathInfo(sourceFile.fileName, pkg)
	}

	generate(ctx: Context) {
		this.reflection = visitSourceFile(this.sourceFile, ctx)
	}
}

export interface PathInfo {
	fileName: string
	folderName: string
	relativePath: string
}

export function getPathInfo(fileName: string, pkg: Package): PathInfo {
	let relativeToPackage = path.relative(pkg.folderPath, fileName)

	return {
		fileName: path.basename(relativeToPackage),
		folderName: path.dirname(relativeToPackage),
		relativePath: relativeToPackage
	}
}
