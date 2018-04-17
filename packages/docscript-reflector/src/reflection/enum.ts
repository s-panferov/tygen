import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import {
	Reflection,
	ReflectionKind,
	ReflectionWithExports,
	BaseReflection,
	ReflectionLink
} from './reflection'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { TypeParameterReflection } from './type-parameter'
import { visitContainer } from './module'
import { isReachable } from './utils'
import { symbolId } from './identifier'

export interface EnumMemberReflection extends BaseReflection {
	name: string
	kind: ReflectionKind.EnumMember
	value?: string | number | undefined
}

export interface EnumReflection extends ReflectionWithExports, BaseReflection {
	name: string
	kind: ReflectionKind.Enum
	members?: EnumMemberReflection[]
}

export function visitEnum(symbol: ts.Symbol, ctx: Context): EnumReflection {
	let enumRef: EnumReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Enum,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, enumRef)
	visitContainer(symbol, enumRef, ctx)

	return enumRef
}

function enumMemberId(symbol: ts.Symbol, ctx: Context) {
	if (isReachable(symbol)) {
		return ctx.checker.getFullyQualifiedName(symbol)
	}
}

export function visitEnumMember(symbol: ts.Symbol, ctx: Context): EnumMemberReflection {
	let enumMemberRef: EnumMemberReflection = {
		id: enumMemberId(symbol, ctx),
		kind: ReflectionKind.EnumMember,
		name: symbol.name
	}

	let declaration = symbol.declarations![0]!
	if (tg.isEnumMember(declaration)) {
		enumMemberRef.value = ctx.checker.getConstantValue(declaration)
	}

	return enumMemberRef
}
