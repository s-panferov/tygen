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
import {
	visitObjectProperties,
	ReflectionWithProperties,
	ObjectLikeReflection,
	visitObjectLikeReflection
} from './interface'
import {
	ReflectionWithCallSignatures,
	ReflectionWithConstructSignatures,
	ReflectionWithIndexSignatures,
	visitCallSignatures
} from './signature'
import { symbolId } from './identifier'

export interface ObjectLiteralReflection
	extends BaseReflection,
		ObjectLikeReflection,
		ReflectionWithCallSignatures {
	kind: ReflectionKind.ObjectLiteral
}

export function visitObjectLiteral(
	symbol: ts.Symbol,
	ctx: Context,
	type?: ts.Type
): ObjectLiteralReflection {
	let objectLiteralRef: ObjectLiteralReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.ObjectLiteral
	}

	ctx.registerSymbol(symbol, objectLiteralRef)

	const declaredType = type || ctx.checker.getDeclaredTypeOfSymbol(symbol)

	visitObjectLikeReflection(symbol, declaredType, objectLiteralRef, ctx)
	visitCallSignatures(declaredType, objectLiteralRef, ctx)

	return objectLiteralRef
}
