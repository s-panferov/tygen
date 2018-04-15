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
import { ObjectLiteralReflection } from './object'
import { TypeReflection, visitType } from './type/type'
import {
	ReflectionWithCallSignatures,
	ReflectionWithConstructSignatures,
	visitCallSignatures,
	visitConstructSignatures,
	ReflectionWithIndexSignatures,
	visitIndexSignatures
} from './signature'
import { symbolId } from './identifier'
import {
	ReflectionWithTypeParameters,
	ReflectionWithHeritageClauses,
	ReflectionWithBaseTypes,
	HeritageClauseReflection,
	visitBaseTypes,
	visitObjectLikeReflection,
	ObjectLikeReflection
} from './interface'

export interface ClassReflection
	extends ReflectionWithExports,
		BaseReflection,
		ObjectLikeReflection,
		ReflectionWithTypeParameters,
		ReflectionWithHeritageClauses,
		ReflectionWithBaseTypes {
	kind: ReflectionKind.Class
	name: string
}

export function visitClass(symbol: ts.Symbol, ctx: Context): ClassReflection {
	let classRef: ClassReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Class,
		name: symbol.name
	}

	ctx.register(symbol, classRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)

	visitContainer(symbol, classRef, ctx)
	visitBaseTypes(symbol, type, classRef, ctx)
	visitObjectLikeReflection(symbol, type, classRef, ctx)

	return classRef
}
