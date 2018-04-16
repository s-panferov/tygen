import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, visitType, TypeReflection } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface IndexedAccessReflection extends TypeReflectionBase {
	typeKind: TypeKind.IndexedAccess
	indexType: TypeReflection
	objectType: TypeReflection
}

export function visitIndexedAccess(
	type: ts.IndexedAccessType,
	ctx: Context
): IndexedAccessReflection {
	let reflection: IndexedAccessReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.IndexedAccess,
		indexType: undefined as any,
		objectType: undefined as any
	}

	ctx.registerType(type, reflection)

	reflection.indexType = visitType(type.indexType, ctx)
	reflection.objectType = visitType(type.objectType, ctx)

	return reflection
}
