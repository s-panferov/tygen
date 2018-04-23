import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeReflectionBase, TypeKind, TypeReflection } from '../reflection'
import { ReflectionKind } from '../../reflection'
import { Context } from '../../../context'
import { IntersectionTypeReflection } from './reflection'

export function visitIntersection(
	type: ts.IntersectionType,
	ctx: Context
): IntersectionTypeReflection {
	const reflection: IntersectionTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Intersection,
		types: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.types = type.types.map(type => visitType(type, ctx))

	return reflection
}

export interface UnionTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Union
	types: TypeReflection[]
}

export function visitUnion(type: ts.UnionType, ctx: Context): UnionTypeReflection {
	const reflection: UnionTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Union,
		types: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.types = type.types.map(type => visitType(type, ctx))

	return reflection
}
