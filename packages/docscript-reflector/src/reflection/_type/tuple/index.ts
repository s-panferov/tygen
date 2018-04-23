import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeKind } from '../reflection'
import { ReflectionKind } from '../../reflection'
import { Context } from '../../../context'
import { TupleReflection } from './reflection'

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
