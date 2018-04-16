import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface LiteralTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Literal
	value: number | string | boolean
}

export function visitLiteral(type: ts.LiteralType, ctx: Context): LiteralTypeReflection {
	let reflection: LiteralTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Literal,
		value: type.value
	}

	ctx.registerType(type, reflection)
	return reflection
}

export function visitBooleanLiteral(type: ts.Type, ctx: Context): LiteralTypeReflection {
	let intristicName = (type as any).intrinsicName
	let reflection: LiteralTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Literal,
		value: intristicName === 'true'
	}
	ctx.registerType(type, reflection)
	return reflection
}
