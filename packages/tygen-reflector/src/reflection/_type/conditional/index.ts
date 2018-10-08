import * as ts from 'typescript'

import { visitType } from '../index'
import { Context } from '../../../context'
import { ConditionalTypeReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitConditional(
	type: ts.ConditionalType,
	ctx: Context
): ConditionalTypeReflection {
	const reflection: ConditionalTypeReflection = {
		kind: ReflectionKind.ConditionalType,
		checkType: undefined as any,
		extendsType: undefined as any
	}

	ctx.registerType(type, reflection)

	if (type.root.inferTypeParameters) {
		reflection.inferTypeParameters = type.root.inferTypeParameters.map(ty => visitType(ty, ctx))
	}

	reflection.checkType = visitType(type.root.checkType, ctx)
	reflection.extendsType = visitType(type.root.extendsType, ctx)

	reflection.trueType = visitType(type.root.trueType, ctx)
	reflection.falseType = visitType(type.root.falseType, ctx)

	return reflection
}
