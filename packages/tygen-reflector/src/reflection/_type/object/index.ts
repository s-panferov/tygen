import ts from 'typescript'

import { Context } from '../../../context'
import { visitObjectLikeReflection } from '../../interface'
import { visitCallSignatures } from '../../signature'
import { ObjectTypeReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitObjectLiteral(type: ts.Type, ctx: Context): ObjectTypeReflection {
	let objectRef: ObjectTypeReflection = {
		kind: ReflectionKind.ObjectLiteralType
	}

	ctx.registerType(type, objectRef)

	visitObjectLikeReflection(type, objectRef, ctx)
	visitCallSignatures(type, objectRef, ctx)

	return objectRef
}
