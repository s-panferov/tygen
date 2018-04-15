import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface IntersectionTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Intersection
	types: TypeReflection[]
}

export function visitIntersection(
	type: ts.IntersectionType,
	ctx: Context
): IntersectionTypeReflection {
	return {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Intersection,
		types: type.types.map(type => visitType(type, ctx))
	}
}

export interface UnionTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Union
	types: TypeReflection[]
}

export function visitUnion(type: ts.UnionType, ctx: Context): UnionTypeReflection {
	return {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Union,
		types: type.types.map(type => visitType(type, ctx))
	}
}
