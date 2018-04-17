import { ReflectionKind, BaseReflection } from './reflection'
import ts, { Expression, HeritageClause } from 'typescript'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { symbolId } from './identifier'
import { TypeReflectionBase, TypeKind } from './type/type'

export interface TypeParameterReflection extends TypeReflectionBase {
	name: string
	kind: ReflectionKind.Type
	typeKind: TypeKind.TypeParameter
	constraint?: never
	default?: never
	expression?: never
}

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
