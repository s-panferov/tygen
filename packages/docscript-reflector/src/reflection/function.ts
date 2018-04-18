import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import {
	Reflection,
	ReflectionKind,
	ReflectionWithExports,
	BaseReflection,
	ReflectionLink,
	HasId,
	createLink
} from './reflection'

import { Context } from '../context'
import { visitSymbol } from './visitor'
import { TypeParameterReflection } from './type-parameter'
import { visitContainer } from './module'
import { isReachable } from './utils'
import { visitObjectProperties } from './interface'
import {
	visitSignature,
	SignatureReflection,
	ReflectionWithCallSignatures,
	visitCallSignatures
} from './signature'
import { symbolId } from './identifier'

export interface FunctionBaseReflection extends BaseReflection, ReflectionWithCallSignatures {}

export interface FunctionReflection extends ReflectionWithExports, FunctionBaseReflection {
	kind: ReflectionKind.Function
}

export interface MethodReflection extends FunctionBaseReflection {
	kind: ReflectionKind.Method
}

function functionId(symbol: ts.Symbol, ctx: Context) {
	if (isReachable(symbol)) {
		return ctx.checker.getFullyQualifiedName(symbol)
	}
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
