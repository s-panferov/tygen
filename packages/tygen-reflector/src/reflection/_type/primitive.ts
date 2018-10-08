import * as ts from 'typescript'

import { TypeReflection } from './reflection'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export function visitPrimitive(type: ts.Type, ctx: Context): TypeReflection | undefined {
	let reflection: TypeReflection | undefined

	if (type.flags & ts.TypeFlags.Any) {
		reflection = {
			kind: ReflectionKind.AnyType
		}
	} else if (type.flags & ts.TypeFlags.Boolean) {
		reflection = {
			kind: ReflectionKind.BooleanType
		}
	} else if (type.flags & ts.TypeFlags.Never) {
		reflection = {
			kind: ReflectionKind.NeverType
		}
	} else if (type.flags & ts.TypeFlags.Null) {
		reflection = {
			kind: ReflectionKind.NullType
		}
	} else if (type.flags & ts.TypeFlags.Undefined) {
		reflection = {
			kind: ReflectionKind.UndefinedType
		}
	} else if (type.flags & ts.TypeFlags.Number) {
		reflection = {
			kind: ReflectionKind.NumberType
		}
	} else if (type.flags & ts.TypeFlags.String) {
		reflection = {
			kind: ReflectionKind.StringType
		}
	} else if (type.flags & ts.TypeFlags.Void) {
		reflection = {
			kind: ReflectionKind.VoidType
		}
	} else if (type.flags & ts.TypeFlags.Unknown) {
		reflection = {
			kind: ReflectionKind.UnknownType
		}
	} else if (type.flags & ts.TypeFlags.NonPrimitive) {
		reflection = {
			kind: ReflectionKind.ObjectType
		}
	}

	if (reflection) {
		ctx.registerType(type, reflection)
	}

	return reflection
}
