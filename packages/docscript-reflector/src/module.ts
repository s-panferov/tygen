import ts, { ModuleReference, createExternalModuleReference } from 'typescript'
import path from 'path'

import { Package } from './package'
import { Context } from './context'

import { visitSymbol } from './reflection/visitor'
import { visitModule, ModuleReflection, visitSourceFile } from './reflection/module'
import { ReflectionKind } from './reflection/reflection'

interface WithLocals {
	locals: Map<string, ts.Symbol>
}

export class Module {
	sourceFile: ts.SourceFile & WithLocals
	pkg: Package
	pathInfo: PathInfo

	reflection!: ModuleReflection

	constructor(pkg: Package, sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile as ts.SourceFile & WithLocals
		this.pkg = pkg
		this.pathInfo = getPathInfo(sourceFile.fileName, pkg)
	}

	generate(ctx: Context) {
		visitSourceFile(this.sourceFile, ctx)
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
