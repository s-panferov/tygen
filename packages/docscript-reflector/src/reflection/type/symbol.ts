import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export interface LiteralTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Literal
	value: number | string
}

export function visitLiteral(type: ts.LiteralType, ctx: Context): LiteralTypeReflection {
	return {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Literal,
		value: type.value
	}
}
