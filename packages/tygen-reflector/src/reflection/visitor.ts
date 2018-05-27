import * as ts from 'typescript'

import { Context } from '../context'
import { visitInterface } from './interface'
import { visitProperty } from './property'
import { visitModule } from './module'

import { Reflection } from './reflection'
import { visitEnum, visitEnumMember } from './enum'
import { visitFunction, visitMethod } from './function'
import { visitClass } from './class'
import { visitTypeAlias } from './type-alias'
import { visitVariable } from './variable'

export function visitSymbol(
	symbol: ts.Symbol,
	ctx: Context,
	_type?: ts.Type
): Reflection | undefined {
	if (ctx.visitedReflections.has(symbol)) {
		return ctx.reflectionBySymbol.get(symbol)
	}

	ctx.visitedReflections.add(symbol)

	let reflection: Reflection | undefined

	if (symbol.flags & ts.SymbolFlags.Module) {
		reflection = visitModule(symbol, ctx)
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
	} else if (symbol.flags & ts.SymbolFlags.Property) {
	} else if (symbol.flags & ts.SymbolFlags.Accessor) {
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
	}

	if (reflection && !ctx.reflectionBySymbol.get(symbol)) {
		debugger
		throw new Error('Symbol reflection was not registered')
	}

	return reflection
}
