import * as ts from 'typescript'

import { Context } from '../context'
import { visitInterface } from './interface'
import { visitProperty } from './property'
import { visitTypeParameter } from './type-parameter'
import { visitModule } from './module'

import { Reflection } from './reflection'
import { visitEnum, visitEnumMember } from './enum'
import { visitObjectLiteral } from './object'
import { visitFunction, visitMethod } from './function'
import { visitFunctionScopedVariable } from './signature'
import { visitClass } from './class'
import { visitTypeAlias } from './type-alias'
import { visitVariable } from './variable'

export function visitSymbol(symbol: ts.Symbol, ctx: Context): Reflection | undefined {
	if (ctx.visited.has(symbol)) {
		return ctx.reflectionBySymbol.get(symbol)
	}

	ctx.visited.add(symbol)

	let reflection: Reflection | undefined

	if (symbol.flags & ts.SymbolFlags.Module) {
		reflection = visitModule(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Enum) {
		reflection = visitEnum(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Class) {
		reflection = visitClass(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.ObjectLiteral) {
		reflection = visitObjectLiteral(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.EnumMember) {
		reflection = visitEnumMember(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Interface) {
		reflection = visitInterface(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Property) {
		reflection = visitProperty(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.TypeParameter) {
		reflection = visitTypeParameter(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Function) {
		reflection = visitFunction(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.FunctionScopedVariable) {
		reflection = visitFunctionScopedVariable(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.Method) {
		reflection = visitMethod(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.TypeAlias) {
		reflection = visitTypeAlias(symbol, ctx)
	} else if (symbol.flags & ts.SymbolFlags.BlockScopedVariable) {
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

	if (reflection && !ctx.reflectionBySymbol.get(symbol)) {
		debugger
		throw new Error('Symbol reflection was not registered')
	}

	return reflection
}
