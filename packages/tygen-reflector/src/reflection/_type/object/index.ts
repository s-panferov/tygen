import ts from 'typescript'

import { ReflectionKind } from '../../reflection'
import { Context } from '../../../context'
import { visitObjectLikeReflection } from '../../interface'
import { visitCallSignatures } from '../../signature'
import { TypeKind } from '../reflection'
import { ObjectTypeReflection } from './reflection'

export function visitObjectLiteral(type: ts.Type, ctx: Context): ObjectTypeReflection {
	let objectRef: ObjectTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.ObjectLiteral
	}

	ctx.registerType(type, objectRef)

	visitObjectLikeReflection(type, objectRef, ctx)
	visitCallSignatures(type, objectRef, ctx)

	return objectRef
}
