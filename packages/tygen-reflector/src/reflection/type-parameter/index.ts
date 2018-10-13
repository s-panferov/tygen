import { ReflectionKind } from '../reflection'
import ts from 'typescript'
import { Context } from '../../context'
import { symbolId } from './../identifier'
import { TypeParameterReflection } from './reflection'

export function visitTypeParameter(symbol: ts.Symbol, ctx: Context): TypeParameterReflection {
	const typeParameter: TypeParameterReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.TypeParameter,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, typeParameter)

	return typeParameter
}
