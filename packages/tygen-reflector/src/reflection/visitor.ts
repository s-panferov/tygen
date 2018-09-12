import * as ts from 'typescript'

import { Context } from '../context'
import { visitInterface } from './interface'
import { visitProperty } from './property'
import { visitModule } from './module'

import { Reflection, ReflectionKind, NotIncludedReflection } from './reflection'
import { visitEnum, visitEnumMember } from './enum'
import { visitFunction, visitMethod } from './function'
import { visitClass } from './class'
import { visitTypeAlias } from './type-alias'
import { visitVariable } from './variable'
import { generateIdForSourceFile, symbolId } from './identifier'

export function visitSymbol(
	symbol: ts.Symbol,
	ctx: Context,
	_type?: ts.Type
): Reflection | undefined {
	if (ctx.visitedReflections.has(symbol)) {
		return ctx.reflectionBySymbol.get(symbol)
	}

	if (symbol.flags & ts.SymbolFlags.Alias) {
		symbol = ctx.checker.getAliasedSymbol(symbol)
	}

	symbol = ctx.checker.getMergedSymbol(symbol)

	ctx.visitedReflections.add(symbol)

	// Exclude some reflections
	const declaration = symbol.declarations && symbol.declarations[0]
	if (declaration) {
		const sourceFile = declaration.getSourceFile()
		if (ctx.program.isSourceFileDefaultLibrary(sourceFile)) {
			const reflection: NotIncludedReflection = {
				kind: ReflectionKind.NotIncluded,
				name: symbol.name,
				id: symbolId(symbol, ctx)
			}
			ctx.registerSymbol(symbol, reflection)
			return reflection
		}
	}

	let reflection: Reflection | undefined

	if (symbol.flags & ts.SymbolFlags.Module) {
		reflection = visitModule(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Alias) {
		reflection = visitVariable(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Enum) {
		reflection = visitEnum(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Class) {
		reflection = visitClass(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.EnumMember) {
		reflection = visitEnumMember(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Interface) {
		reflection = visitInterface(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Method) {
		reflection = visitMethod(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Property || symbol.flags & ts.SymbolFlags.Accessor) {
		reflection = visitProperty(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Function) {
		reflection = visitFunction(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.TypeAlias) {
		reflection = visitTypeAlias(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Variable) {
		reflection = visitVariable(symbol, ctx)
	} else if (
		(symbol.flags & ts.SymbolFlags.ExportStar) |
		(symbol.flags & ts.SymbolFlags.ExportValue) |
		(symbol.flags & ts.SymbolFlags.Alias)
	) {
	} else {
		debugger
		throw new Error('Unknown symbol')
	}

	if (reflection) {
		let comment = symbol.getDocumentationComment(ctx.checker)
		if (comment.length > 0) {
			reflection.comments = comment
		}

		let directive = symbol.getJsDocTags()
		if (directive.length > 0) {
			reflection.directives = directive
		}

		if (symbol.declarations && symbol.declarations.length) {
			reflection.definedIn = symbol.declarations.map(decl => {
				return {
					source: generateIdForSourceFile(decl.getSourceFile(), ctx).join(''),
					start: decl.getStart(undefined, true),
					end: decl.getEnd()
				}
			})
		}
	}

	if (reflection && !ctx.reflectionBySymbol.get(symbol)) {
		debugger
		throw new Error('Symbol reflection was not registered')
	}

	return reflection
}
