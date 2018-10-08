import * as ts from 'typescript'

import { visitType } from '../index'
import { Context } from '../../../context'
import { IndexTypeReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitIndexType(type: ts.IndexType, ctx: Context): IndexTypeReflection {
	let reflection: IndexTypeReflection = {
		kind: ReflectionKind.IndexType,
		type: undefined as any
	}

	ctx.registerType(type, reflection)

	if (type.type) {
		reflection.type = visitType(type.type, ctx)
	}

	return reflection
}
