import { ReflectionKind, BaseReflection, ReflectionWithExports } from './reflection'
import ts, { Expression, HeritageClause } from 'typescript'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { symbolId } from './identifier'
import { TypeReflection, visitType } from './type/type'

export interface TypeAliasReflection extends BaseReflection, ReflectionWithExports {
	name: string
	kind: ReflectionKind.TypeAlias
	type: TypeReflection
}

export function visitTypeAlias(symbol: ts.Symbol, ctx: Context): TypeAliasReflection {
	let typeAliasRef: TypeAliasReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.TypeAlias,
		name: symbol.name,
		type: undefined as any
	}

	ctx.registerSymbol(symbol, typeAliasRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	typeAliasRef.type = visitType(type, ctx)

	return typeAliasRef
}
