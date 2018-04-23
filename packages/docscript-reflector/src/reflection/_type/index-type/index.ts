import * as ts from 'typescript'

import { visitType } from '../index'
import { TypeKind } from '../reflection'
import { ReflectionKind, createLink } from '../../reflection'
import { Context } from '../../../context'
import { IndexTypeReflection } from './reflection'

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
