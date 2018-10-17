import ts from 'typescript'
import path from 'path'

import { Package } from './package'
import { Context } from './context'

import { visitSourceFile } from './reflection/module'
import { ESModuleReflection, DeclarationFileReflection } from './reflection/module/reflection'

export class SourceFileMeta {
	pkg: Package
	sourceFile: ts.SourceFile
	pathInfo: PathInfo
	included: boolean

	reflection!: ESModuleReflection | DeclarationFileReflection

	constructor(pkg: Package, sourceFile: ts.SourceFile, included: boolean) {
		this.sourceFile = sourceFile as ts.SourceFile
		this.pkg = pkg
		this.pathInfo = getPathInfo(sourceFile.fileName, pkg)
		this.included = included
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
