import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'
import * as path from 'path'

import {
	Reflection,
	ReflectionKind,
	BaseReflection,
	ReflectionWithExports,
	ReflectionLink,
	createLink
} from './reflection'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { symbolId, declarationId } from './identifier'

export interface ModuleReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.Module
	name: string
}

export interface NamespaceReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.Namespace
	name: string
}

export interface ESModuleReflection extends BaseReflection, ReflectionWithExports {
	kind: ReflectionKind.ESModule
	name: string
	folder: string
}

export function visitModule(symbol: ts.Symbol, ctx: Context): Reflection {
	if (symbol.flags & ts.SymbolFlags.ValueModule) {
		let reflection: ModuleReflection = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.Module,
			name: symbol.name,
			exports: []
		}

		ctx.registerSymbol(symbol, reflection)
		visitContainer(symbol, reflection, ctx)
		return reflection
	} else if (symbol.flags & ts.SymbolFlags.NamespaceModule) {
		let reflection: NamespaceReflection = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.Namespace,
			name: symbol.name,
			exports: []
		}

		ctx.registerSymbol(symbol, reflection)
		visitContainer(symbol, reflection, ctx)
		return reflection
	}

	let sourceFile = symbol.declarations![0]!.getSourceFile()
	let reflection = visitSourceFile(sourceFile, ctx)
	ctx.registerSymbol(symbol, reflection)

	return reflection
}

export function visitSourceFile(sourceFile: ts.SourceFile, ctx: Context): ESModuleReflection {
	let module = ctx.generator.getModule(sourceFile.fileName)!
	let moduleRef: ESModuleReflection = {
		id: declarationId(sourceFile, ctx),
		kind: ReflectionKind.ESModule,
		name: module.pathInfo.fileName,
		folder: module.pathInfo.folderName
	}

	let symbol = ctx.checker.getSymbolAtLocation(sourceFile)
	ctx.registerReflectionById(moduleRef, symbol)

	function visitNode(node: ts.Node) {
		let symbol = (node as any).symbol
		if (symbol) {
			visitSymbol(symbol, ctx)
		} else {
			if (ts.isVariableStatement(node)) {
				node.declarationList.forEachChild(visitNode)
			} else if (node.kind & ts.SyntaxKind.ObjectBindingPattern) {
			} else {
				debugger
			}
		}
	}

	sourceFile.statements.forEach(visitNode)

	return moduleRef
}

export function visitContainer(symbol: ts.Symbol, parent: ReflectionWithExports, ctx: Context) {
	let exp = symbol.exports
	if (exp) {
		exp.forEach(item => {
			let reflection = visitSymbol(item, ctx)
			if (reflection) {
				if (!parent.exports) {
					parent.exports = []
				}
				parent.exports.push(createLink(reflection))
			}
		})
	}

	return module
}
