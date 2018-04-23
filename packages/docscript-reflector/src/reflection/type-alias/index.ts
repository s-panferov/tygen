import { ReflectionKind } from '../reflection'
import ts from 'typescript'
import { Context } from '../../context'
import { symbolId } from '../identifier'
import { visitType } from '../_type'
import { TypeAliasReflection } from './reflection'

export function visitTypeAlias(symbol: ts.Symbol, ctx: Context): TypeAliasReflection {
	let typeAliasRef: TypeAliasReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.TypeAlias,
		name: symbol.name,
		type: undefined as any
	}

	ctx.registerSymbol(symbol, typeAliasRef)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol)

	typeAliasRef.type = visitType(type, ctx)

	return typeAliasRef
}
