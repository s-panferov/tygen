import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind } from '../reflection'
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

	reflection.target = visitType(type.target, ctx)
	reflection.typeArguments =
		type.typeArguments && type.typeArguments.map(arg => visitType(arg, ctx))

	return reflection
}
