import ts from 'typescript'
import * as tg from 'tsutils/typeguard'

import { EnumMemberReflection, EnumReflection } from './reflection'
import { Context } from '../../context'
import { visitContainer } from '../module'
import { symbolId } from '../identifier'
import { ReflectionKind } from '../reflection'

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

export function visitEnumMember(symbol: ts.Symbol, ctx: Context): EnumMemberReflection {
	let enumMemberRef: EnumMemberReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.EnumMember,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, enumMemberRef)

	let declaration = symbol.declarations![0]!
	if (tg.isEnumMember(declaration)) {
		enumMemberRef.value = ctx.checker.getConstantValue(declaration)
	}

	return enumMemberRef
}
