import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, visitType, TypeReflection } from './type'
import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'

export interface IndexTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Index
	type: TypeReflection
}

export function visitIndexType(type: ts.IndexType, ctx: Context): IndexTypeReflection {
	let reflection: IndexTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Index,
		type: undefined as any
	}

	ctx.registerType(type, reflection)

	if (type.type) {
		reflection.type = createLink(visitType(type.type, ctx))
	}

	return reflection
}
