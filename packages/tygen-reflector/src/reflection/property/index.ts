import ts from 'typescript'

import { ReflectionKind, createLink, ReflectionLink } from '../reflection'
import { Context } from '../../context'
import { visitType } from '../_type'
import { symbolId } from '../identifier'
import { PropertyReflection } from './reflection'
import { visitSymbol } from '../visitor'

export function visitProperty(symbol: ts.Symbol, ctx: Context): PropertyReflection {
	let propertyRef: PropertyReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Property,
		name: symbol.name,
		type: undefined as any,
		getter: !!(symbol.flags & ts.SymbolFlags.GetAccessor),
		setter: !!(symbol.flags & ts.SymbolFlags.SetAccessor)
	}

	ctx.registerSymbol(symbol, propertyRef)

	let type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	let typeReflection = visitType(type, ctx)

	propertyRef.type = typeReflection

	const parentSymbol = getSymbolParent(symbol)
	if (
		parentSymbol &&
		(parentSymbol.flags & ts.SymbolFlags.Interface || parentSymbol.flags & ts.SymbolFlags.Class)
	) {
		const parentReflection = parentSymbol && visitSymbol(parentSymbol, ctx)
		const link = parentReflection && (createLink(parentReflection) as ReflectionLink)
		if (link) {
			propertyRef.origin = link
		}
	}

	return propertyRef
}

export function getSymbolParent(symbol: ts.Symbol): ts.Symbol | undefined {
	if ((symbol as any).parent) {
		return (symbol as any).parent
	}

	return
}
