import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'

export interface SubstitutionTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Substitution
	typeVariable: TypeReflection
	substitute: TypeReflection
}

export function visitSubstitution(
	type: ts.SubstitutionType,
	ctx: Context
): SubstitutionTypeReflection {
	const reflection: SubstitutionTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Substitution,
		typeVariable: undefined as any,
		substitute: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.typeVariable = visitType(type.typeVariable, ctx)
	reflection.substitute = visitType(type.substitute, ctx)

	return reflection
}
