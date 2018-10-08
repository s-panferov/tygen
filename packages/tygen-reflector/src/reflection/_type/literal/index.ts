import * as ts from 'typescript'

import { Context } from '../../../context'
import { LiteralTypeReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export function visitLiteral(type: ts.LiteralType, ctx: Context): LiteralTypeReflection {
	let reflection: LiteralTypeReflection = {
		kind: ReflectionKind.LiteralType,
		value: type.value
	}

	ctx.registerType(type, reflection)
	return reflection
}

export function visitBooleanLiteral(type: ts.Type, ctx: Context): LiteralTypeReflection {
	let intristicName = (type as any).intrinsicName
	let reflection: LiteralTypeReflection = {
		kind: ReflectionKind.LiteralType,
		value: intristicName === 'true'
	}
	ctx.registerType(type, reflection)
	return reflection
}
