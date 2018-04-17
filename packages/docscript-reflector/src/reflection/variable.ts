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
	ReflectionWithIndexSignatures
} from './signature'
import { symbolId } from './identifier'
import { TypeReflection, visitType } from './type/type'

export interface VariableReflection extends BaseReflection {
	kind: ReflectionKind.Variable
	name: string
	type: TypeReflection
}

export function visitVariable(symbol: ts.Symbol, ctx: Context): VariableReflection {
	let variableRef: VariableReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Variable,
		name: symbol.name,
		type: undefined as any
	}

	ctx.registerSymbol(symbol, variableRef)

	let type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	variableRef.type = visitType(type, ctx)

	return variableRef
}
