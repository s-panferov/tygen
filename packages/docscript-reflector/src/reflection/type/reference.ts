import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'

export interface TypeReferenceReflection extends TypeReflectionBase {
	typeKind: TypeKind.TypeReference
	target: TypeReflection
	typeArguments?: TypeReflection[]
}

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
