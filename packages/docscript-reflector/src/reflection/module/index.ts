import ts from 'typescript'

import {
	Reflection,
	ReflectionKind,
	ReflectionWithExports,
	createLink,
	BaseReflection
} from '../reflection'
import { Context } from '../../context'
import { visitSymbol } from '../visitor'
import { symbolId, declarationId } from '../identifier'
import { ModuleReflection, NamespaceReflection, ESModuleReflection } from './reflection'

export function visitModule(symbol: ts.Symbol, ctx: Context): Reflection {
	if (symbol.flags & ts.SymbolFlags.ValueModule) {
		const reflection: ModuleReflection = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.Module,
			name: symbol.name,
			exports: []
		}

		ctx.registerSymbol(symbol, reflection)
		visitContainer(symbol, reflection, ctx)
		return reflection
	} else if (symbol.flags & ts.SymbolFlags.NamespaceModule) {
		const reflection: NamespaceReflection = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.Namespace,
			name: symbol.name,
			exports: []
		}

		ctx.registerSymbol(symbol, reflection)
		visitContainer(symbol, reflection, ctx)
		return reflection
	}

	const sourceFile = symbol.declarations![0]!.getSourceFile()
	const reflection = visitSourceFile(sourceFile, ctx)
	ctx.registerSymbol(symbol, reflection)

	return reflection
}

const visited = new WeakMap<BaseReflection, Set<ts.Symbol>>()

function hasExport(reflection: BaseReflection, symbol: ts.Symbol): boolean {
	let item = visited.get(reflection)
	if (!item) {
		return false
	}

	return item.has(symbol)
}

function setVisited(reflection: BaseReflection, symbol: ts.Symbol) {
	let item = visited.get(reflection)
	if (!item) {
		visited.set(reflection, new Set([symbol]))
	} else {
		item.add(symbol)
	}
}

export function visitSourceFile(sourceFile: ts.SourceFile, ctx: Context): ESModuleReflection {
	const module = ctx.generator.getModule(sourceFile.fileName)!
	const moduleRef: ESModuleReflection = {
		id: declarationId(sourceFile, ctx),
		kind: ReflectionKind.ESModule,
		name: module.pathInfo.fileName,
		folder: module.pathInfo.folderName
	}

	const symbol = ctx.checker.getSymbolAtLocation(sourceFile)
	ctx.registerReflectionById(moduleRef, symbol)

	if (symbol) {
		visitContainer(symbol, moduleRef, ctx)
	} else {
		function visitNode(node: ts.Node) {
			let symbol = (node as any).symbol
			if (symbol && !hasExport(moduleRef, symbol)) {
				setVisited(moduleRef, symbol)
				let ref = visitSymbol(symbol, ctx)
				if (ref) {
					if (!moduleRef.exports) {
						moduleRef.exports = []
					}
					moduleRef.exports.push(createLink(ref))
				}
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
	}

	return moduleRef
}

export enum VisitResult {
	Skip,
	Export
}

export function visitContainer(
	symbol: ts.Symbol,
	refl: ReflectionWithExports,
	ctx: Context,
	cb?: (refl: Reflection) => VisitResult
) {
	// !!symbol.exports check needed because `getExportsOfModule` crashes otherwise
	let exp = symbol.exports && ctx.checker.getExportsOfModule(symbol)
	if (exp) {
		exp.forEach(item => {
			if (hasExport(refl, item)) {
				return
			}

			setVisited(refl, item)

			let reflection = visitSymbol(item, ctx)
			if (reflection) {
				if (!cb || cb(reflection) === VisitResult.Export) {
					if (!refl.exports) {
						refl.exports = []
					}
					refl.exports.push(createLink(reflection))
				}
			}
		})
	}

	return module
}
