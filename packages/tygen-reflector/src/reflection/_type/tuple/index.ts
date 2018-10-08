import * as ts from 'typescript'

import { visitType } from '../index'
import { Context } from '../../../context'
import { TupleReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitTuple(type: ts.TypeReference, ctx: Context): TupleReflection {
	let reflection: TupleReflection = {
		kind: ReflectionKind.TupleType,
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
