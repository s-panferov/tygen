import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeKind } from '../reflection'
import { ReflectionKind } from '../../reflection'
import { Context } from '../../../context'
import { SubstitutionTypeReflection } from './reflection'

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
