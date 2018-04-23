import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeKind } from '../reflection'
import { ReflectionKind, createLink } from '../../reflection'
import { Context } from '../../../context'
import { IndexedAccessReflection } from './reflection'

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

	reflection.indexType = createLink(visitType(type.indexType, ctx))
	reflection.objectType = createLink(visitType(type.objectType, ctx))

	return reflection
}
