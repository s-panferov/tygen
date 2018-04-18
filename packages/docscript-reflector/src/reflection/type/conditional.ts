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

	reflection.checkType = createLink(visitType(type.root.checkType, ctx))
	reflection.extendsType = createLink(visitType(type.root.extendsType, ctx))

	reflection.trueType = createLink(visitType(type.root.trueType, ctx))
	reflection.falseType = createLink(visitType(type.root.falseType, ctx))

	return reflection
}
