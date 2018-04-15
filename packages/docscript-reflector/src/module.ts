import ts, { ModuleReference, createExternalModuleReference } from 'typescript'
import path from 'path'

import { Package } from './package'
import { Context } from './context'

import { visitSymbol } from './reflection/visitor'
import { visitModule, ModuleReflection } from './reflection/module'
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

	ensureOwnReflection(ctx: Context): ts.Symbol | undefined {
		let symbol = ctx.checker.getSymbolAtLocation(this.sourceFile)
		if (this.reflection) {
			return symbol
		}

		this.reflection = {
			kind: ReflectionKind.Module,
			name: this.pathInfo.relativePath
		}

		return symbol
	}

	generate(ctx: Context) {
		let symbol = this.ensureOwnReflection(ctx)
		if (symbol) {
			visitModule(symbol, ctx)
		}
	}
}

export interface PathInfo {
	fileName: string
	relativePath: string
}

export function getPathInfo(fileName: string, pkg: Package): PathInfo {
	let relativeToPackage = path.relative(pkg.folderPath, fileName)

	if (!/^(\.|\/)/.test(relativeToPackage)) {
		relativeToPackage = '/' + relativeToPackage
	}

	return {
		fileName,
		relativePath: relativeToPackage
	}
}
