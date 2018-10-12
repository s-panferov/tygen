import ts from 'typescript'

import { ReflectionKind } from '../reflection'

import { Context } from '../../context'
import { visitContainer } from '../module'
import { visitCallSignatures } from '../signature'
import { symbolId } from '../identifier'
import { FunctionReflection, MethodReflection } from './reflection'

export function escapeName(name: string): string {
	return name.replace(/[@"'\-]/g, '')
}

export function visitFunction(symbol: ts.Symbol, ctx: Context): FunctionReflection {
	let functionRef: FunctionReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Function,
		// escape internal typescript names like __@iterator
		name: escapeName(symbol.name),
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
		name: escapeName(symbol.name),
		allCallSignatures: []
	}

	ctx.registerSymbol(symbol, methodRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	visitCallSignatures(type, methodRef, ctx)

	return methodRef
}
