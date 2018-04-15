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
	return {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.IndexedAccess,
		indexType: visitType(type.indexType, ctx),
		objectType: visitType(type.objectType, ctx)
	}
}
