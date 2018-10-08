import * as ts from 'typescript'

import { visitType } from '../index'
import { Context } from '../../../context'
import { IntersectionTypeReflection, UnionTypeReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitIntersection(
	type: ts.IntersectionType,
	ctx: Context
): IntersectionTypeReflection {
	const reflection: IntersectionTypeReflection = {
		kind: ReflectionKind.IntersectionType,
		types: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.types = type.types.map(type => visitType(type, ctx))

	return reflection
}

export function visitUnion(type: ts.UnionType, ctx: Context): UnionTypeReflection {
	const reflection: UnionTypeReflection = {
		kind: ReflectionKind.UnionType,
		types: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.types = type.types.map(type => visitType(type, ctx))

	return reflection
}
