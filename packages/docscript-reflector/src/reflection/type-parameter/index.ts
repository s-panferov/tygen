import { ReflectionKind } from '../reflection'
import ts from 'typescript'
import { Context } from '../../context'
import { symbolId } from './../identifier'
import { TypeKind } from '../_type/reflection'
import { TypeParameterReflection } from './reflection'

export function visitTypeParameter(tp: ts.TypeParameter, ctx: Context): TypeParameterReflection {
	let typeParameter: TypeParameterReflection = {
		id: symbolId(tp.symbol!, ctx),
		kind: ReflectionKind.Type,
		typeKind: TypeKind.TypeParameter,
		name: tp.symbol!.name
	}

	ctx.registerSymbol(tp.symbol!, typeParameter)
	ctx.registerType(tp, typeParameter)

	return typeParameter
}
