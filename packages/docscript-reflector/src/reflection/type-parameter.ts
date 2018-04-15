import { ReflectionKind, BaseReflection } from './reflection'
import ts, { Expression, HeritageClause } from 'typescript'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { symbolId } from './identifier'

export interface TypeParameterReflection extends BaseReflection {
	name: string
	kind: ReflectionKind.TypeParameter
	constraint?: never
	default?: never
	expression?: never
}

export function visitTypeParameter(symbol: ts.Symbol, ctx: Context): TypeParameterReflection {
	let typeParameter: TypeParameterReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.TypeParameter,
		name: symbol.name
	}

	ctx.register(symbol, typeParameter)
	return typeParameter
}
