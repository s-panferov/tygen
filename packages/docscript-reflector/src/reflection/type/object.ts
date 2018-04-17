import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import {
	Reflection,
	ReflectionKind,
	ReflectionWithExports,
	BaseReflection,
	ReflectionLink,
	HasId,
	createLink
} from '../reflection'
import { Context } from '../../context'
import { visitSymbol } from '../visitor'
import { TypeParameterReflection } from '../type-parameter'
import { visitContainer } from '../module'
import { isReachable } from '../utils'
import {
	visitObjectProperties,
	ReflectionWithProperties,
	ObjectLikeReflection,
	visitObjectLikeReflection
} from '../interface'
import {
	ReflectionWithCallSignatures,
	ReflectionWithConstructSignatures,
	ReflectionWithIndexSignatures,
	visitCallSignatures
} from '../signature'
import { symbolId } from '../identifier'
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
