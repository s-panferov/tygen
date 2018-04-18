import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface TupleReflection extends TypeReflectionBase {
	typeKind: TypeKind.Tuple
	types: TypeReflection[]
}

export function visitTuple(type: ts.TypeReference, ctx: Context): TupleReflection {
	let reflection: TupleReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Tuple,
		types: []
	}

	ctx.registerType(type, reflection)

	if (type.typeArguments) {
		type.typeArguments.forEach(ty => {
			reflection.types.push(visitType(ty, ctx))
		})
	}

	return reflection
}
