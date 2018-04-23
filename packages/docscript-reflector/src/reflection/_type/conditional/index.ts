import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeKind } from '../reflection'
import { ReflectionKind, createLink } from '../../reflection'
import { Context } from '../../../context'
import { ConditionalTypeReflection } from './reflection'

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
