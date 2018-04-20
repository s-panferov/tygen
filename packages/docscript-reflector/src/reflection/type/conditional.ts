import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'

export interface ConditionalTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Conditional
	checkType: TypeReflection
	extendsType: TypeReflection
	trueType?: TypeReflection
	falseType?: TypeReflection
	inferTypeParameters?: TypeReflection[]
}

export function visitConditional(
	type: ts.ConditionalType,
	ctx: Context
): ConditionalTypeReflection {
	const reflection: ConditionalTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Conditional,
		checkType: undefined as any,
		extendsType: undefined as any
	}

	ctx.registerType(type, reflection)

	if (type.root.inferTypeParameters) {
		reflection.inferTypeParameters = type.root.inferTypeParameters.map(ty => visitType(ty, ctx))
	}

	reflection.checkType = createLink(visitType(type.root.checkType, ctx))
	reflection.extendsType = createLink(visitType(type.root.extendsType, ctx))

	reflection.trueType = createLink(visitType(type.root.trueType, ctx))
	reflection.falseType = createLink(visitType(type.root.falseType, ctx))

	return reflection
}
