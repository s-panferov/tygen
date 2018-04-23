import ts from 'typescript'

import { ReflectionKind } from '../reflection'
import { Context } from '../../context'
import { visitType } from '../_type'
import { symbolId } from '../identifier'
import { PropertyReflection } from './reflection'

export function visitProperty(symbol: ts.Symbol, ctx: Context): PropertyReflection {
	let propertyRef: PropertyReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Property,
		name: symbol.name,
		type: undefined as any
	}

	ctx.registerSymbol(symbol, propertyRef)

	let type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	let typeReflection = visitType(type, ctx)

	propertyRef.type = typeReflection

	return propertyRef
}
