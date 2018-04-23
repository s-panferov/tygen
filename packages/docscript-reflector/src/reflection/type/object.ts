import ts from 'typescript'

import { ReflectionKind, BaseReflection } from '../reflection'
import { Context } from '../../context'
import { ObjectLikeReflection, visitObjectLikeReflection } from '../interface'
import { ReflectionWithCallSignatures, visitCallSignatures } from '../signature'
import { TypeKind } from './type'

export interface ObjectTypeReflection
	extends BaseReflection,
		ObjectLikeReflection,
		ReflectionWithCallSignatures {
	kind: ReflectionKind.Type
	typeKind: TypeKind.ObjectLiteral
}

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
