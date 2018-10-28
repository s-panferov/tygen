import { ReflectionKind } from '../reflection'
import ts from 'typescript'
import { Context } from '../../context'
import { symbolId } from './../identifier'
import { TypeParameterReflection } from './reflection'
import { visitType } from '../_type'

export function visitTypeParameter(symbol: ts.Symbol, ctx: Context): TypeParameterReflection {
	const typeParameter: TypeParameterReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.TypeParameter,
		name: symbol.name
	}

	ctx.registerSymbol(symbol, typeParameter)

	const type = ctx.checker.getDeclaredTypeOfSymbol(symbol)
	const constraintType = ctx.checker.getBaseConstraintOfType(type)
	if (constraintType) {
		typeParameter.constraint = visitType(constraintType, ctx)
	}

	const def = ctx.checker.getDefaultFromTypeParameter(type)
	if (def) {
		typeParameter.default = visitType(def, ctx)
	}

	return typeParameter
}
