import * as ts from 'typescript'

import { TypeReflection, TypeKind } from './type'
import { ReflectionKind } from '../reflection'
import { Context } from '../../context'

export function visitPrimitive(type: ts.Type, ctx: Context): TypeReflection | undefined {
	let reflection: TypeReflection | undefined

	if (type.flags & ts.TypeFlags.Any) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Any
		}
	} else if (type.flags & ts.TypeFlags.Boolean) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Boolean
		}
	} else if (type.flags & ts.TypeFlags.Never) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Never
		}
	} else if (type.flags & ts.TypeFlags.Null) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Null
		}
	} else if (type.flags & ts.TypeFlags.Undefined) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Undefined
		}
	} else if (type.flags & ts.TypeFlags.Number) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Number
		}
	} else if (type.flags & ts.TypeFlags.String) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.String
		}
	} else if (type.flags & ts.TypeFlags.Void) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Void
		}
	} else if (type.flags & ts.TypeFlags.NonPrimitive) {
		reflection = {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Object
		}
	}

	if (reflection) {
		ctx.registerType(type, reflection)
	}

	return reflection
}
