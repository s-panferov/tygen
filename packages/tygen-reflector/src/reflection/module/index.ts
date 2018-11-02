import ts from 'typescript'

import { Reflection, ReflectionKind, ReflectionWithExports, BaseReflection } from '../reflection'
import { createLink } from '../utils'
import { Context } from '../../context'
import { visitSymbol } from '../visitor'
import { symbolId, declarationId, generateIdForSourceFile, stringifyId } from '../identifier'
import {
	AmbientModuleReflection,
	NamespaceReflection,
	ESModuleReflection,
	DeclarationFileReflection
} from './reflection'

export function visitModule(symbol: ts.Symbol, ctx: Context): Reflection {
	if (symbol.flags & ts.SymbolFlags.ValueModule && symbol.name.includes(`"`)) {
		const reflection: AmbientModuleReflection = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.AmbientModule,
			name: symbol.name.replace(/"/g, ''),
			exports: []
		}

		ctx.registerSymbol(symbol, reflection)
		visitContainer(symbol, reflection, ctx)
		return reflection
	} else {
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

const visited = new WeakMap<BaseReflection, Set<ts.Symbol | string>>()

function wasVisitedIn(parent: BaseReflection, symbol: ts.Symbol | string): boolean {
	let item = visited.get(parent)
	if (!item) {
		return false
	}

	return item.has(symbol)
}

function setVisitedIn(parent: BaseReflection, symbol: ts.Symbol | string) {
	let item = visited.get(parent)
	if (!item) {
		visited.set(parent, new Set([symbol]))
	} else {
		item.add(symbol)
	}
}

export function visitSourceFile(
	sourceFile: ts.SourceFile,
	ctx: Context
): ESModuleReflection | DeclarationFileReflection {
	const file = ctx.generator.getFile(sourceFile.fileName)!
	const symbol = ctx.checker.getSymbolAtLocation(sourceFile)

	if (symbol) {
		// We have symbols only for ES6 modules
		const moduleRef: ESModuleReflection = {
			id: declarationId(sourceFile, ctx),
			kind: ReflectionKind.ESModule,
			name: file.pathInfo.fileName,
			folder: file.pathInfo.folderName
		}
		ctx.registerSymbol(symbol, moduleRef)
		visitContainer(symbol, moduleRef, ctx)
		return moduleRef
	} else {
		const ambientFileRef: DeclarationFileReflection = {
			id: generateIdForSourceFile(sourceFile, ctx),
			kind: ReflectionKind.DeclarationFile,
			name: file.pathInfo.fileName,
			folder: file.pathInfo.folderName
		}

		ctx.registerReflectionWithoutSymbol(ambientFileRef)

		// Declaration file with global variables
		function visitNode(node: ts.Node) {
			let symbol = (node as any).symbol
			if (symbol) {
				let reflection = visitSymbol(symbol, ctx)
				if (!reflection) {
					return
				}

				const stringId = stringifyId(reflection.id!)

				if (wasVisitedIn(ambientFileRef, stringId)) {
					return
				}

				setVisitedIn(ambientFileRef, stringId)

				const link = createLink(reflection)

				if (!ambientFileRef.exports) {
					ambientFileRef.exports = []
				}
				ambientFileRef.exports.push(link)

				const pkgReflection = file.pkg.reflection
				if (!wasVisitedIn(pkgReflection, stringId)) {
					setVisitedIn(pkgReflection, stringId)
					if (!pkgReflection.globals) {
						pkgReflection.globals = []
					}
					pkgReflection.globals.push(link)
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
		return ambientFileRef
	}
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
	if (!exp) {
		return
	}

	exp.forEach(item => {
		if (wasVisitedIn(refl, item)) {
			return
		}

		setVisitedIn(refl, item)

		if (item.name === 'prototype') {
			return
		}

		let reflection = visitSymbol(item, ctx)
		if (reflection) {
			if (!cb || cb(reflection) === VisitResult.Export) {
				if (!refl.exports) {
					refl.exports = []
				}

				refl.exports.push(
					(item as any).parent === symbol ? reflection : createLink(reflection)
				)
			}
		}
	})

	return
}
