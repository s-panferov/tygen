import ts from 'typescript'

import { ReflectionKind } from '../reflection'

import { Context } from '../../context'
import { visitContainer } from '../module'
import { visitCallSignatures } from '../signature'
import { symbolId } from '../identifier'
import { FunctionReflection, MethodReflection } from './reflection'

export function nameFromDeclaration(symbol: ts.Symbol) {
	const decls = symbol.getDeclarations() as ts.PropertyDeclaration[]
	// Getting name from a declaration to preserve `[Symbol.xxx]: ...` properties
	return decls && decls.length > 0 && decls[0].name ? decls[0].name.getText() : symbol.name
}

export function visitFunction(symbol: ts.Symbol, ctx: Context): FunctionReflection {
	let functionRef: FunctionReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Function,
		// escape internal typescript names like __@iterator
		name: nameFromDeclaration(symbol),
		allCallSignatures: []
	}

	ctx.registerSymbol(symbol, functionRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)

	visitContainer(symbol, functionRef, ctx)
	visitCallSignatures(type, functionRef, ctx)

	return functionRef
}

export function visitMethod(symbol: ts.Symbol, ctx: Context): MethodReflection {
	let methodRef: MethodReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Method,
		name: symbol.name,
		allCallSignatures: []
	}

	ctx.registerSymbol(symbol, methodRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	visitCallSignatures(type, methodRef, ctx)

	return methodRef
}
