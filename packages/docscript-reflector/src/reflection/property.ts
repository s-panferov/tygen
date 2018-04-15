import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import { Reflection, ReflectionKind, BaseReflection } from './reflection'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { visitType, TypeReflection } from './type/type'
import { symbolId } from './identifier'

export interface PropertyReflection extends BaseReflection {
	kind: ReflectionKind.Property
	name: string
	type: TypeReflection
}

export function visitProperty(symbol: ts.Symbol, ctx: Context): PropertyReflection {
	let propertyRef: PropertyReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Property,
		name: symbol.name,
		type: undefined as any
	}

	ctx.register(symbol, propertyRef)

	let type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	let typeReflection = visitType(type, ctx)

	propertyRef.type = typeReflection

	return propertyRef
}
