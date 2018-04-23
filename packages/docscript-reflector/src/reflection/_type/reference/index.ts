import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeKind } from '../reflection'
import { ReflectionKind, createLink } from '../../reflection'
import { Context } from '../../../context'
import { TypeReferenceReflection } from './reflection'

export function visitReference(type: ts.TypeReference, ctx: Context): TypeReferenceReflection {
	const reflection: TypeReferenceReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.TypeReference,
		target: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.target = createLink(visitType(type.target, ctx))
	reflection.typeArguments =
		type.typeArguments && type.typeArguments.map(arg => createLink(visitType(arg, ctx)))

	return reflection
}
