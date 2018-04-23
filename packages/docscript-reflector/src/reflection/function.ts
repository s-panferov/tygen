import ts from 'typescript'

import { ReflectionKind, ReflectionWithExports, BaseReflection } from './reflection'

import { Context } from '../context'
import { visitContainer } from './module'
import { ReflectionWithCallSignatures, visitCallSignatures } from './signature'
import { symbolId } from './identifier'

export interface FunctionBaseReflection extends BaseReflection, ReflectionWithCallSignatures {}

export interface FunctionReflection extends ReflectionWithExports, FunctionBaseReflection {
	kind: ReflectionKind.Function
}

export interface MethodReflection extends FunctionBaseReflection {
	kind: ReflectionKind.Method
}

export function visitFunction(symbol: ts.Symbol, ctx: Context): FunctionReflection {
	let functionRef: FunctionReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Function,
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
		allCallSignatures: []
	}

	ctx.registerSymbol(symbol, methodRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	visitCallSignatures(type, methodRef, ctx)

	return methodRef
}
