import * as ts from 'typescript'

import { ReflectionKind } from '../reflection'
import { Context } from '../../context'
import { TypeKind, TypeReflectionBase } from './type'
import {
	ReflectionWithCallSignatures,
	visitCallSignatures,
	visitConstructSignatures,
	ReflectionWithConstructSignatures
} from '../signature'
import { ReflectionWithProperties, visitObjectProperties } from '../interface'

export interface TypeLiteralReflection
	extends TypeReflectionBase,
		ReflectionWithCallSignatures,
		ReflectionWithConstructSignatures {
	typeKind: TypeKind.TypeLiteral
}

export function visitTypeLiteral(type: ts.Type, ctx: Context): TypeLiteralReflection {
	let typeLiteral: TypeLiteralReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.TypeLiteral
	}

	visitCallSignatures(type, typeLiteral, ctx)
	visitConstructSignatures(type, typeLiteral, ctx)

	return typeLiteral
}
