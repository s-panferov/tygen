import * as ts from 'typescript'

import { TypeReflection, TypeKind } from './type'
import { ReflectionKind } from '../reflection'

export function visitPrimitive(type: ts.Type): TypeReflection | undefined {
	if (type.flags & ts.TypeFlags.Any) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Any
		}
	} else if (type.flags & ts.TypeFlags.Boolean) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Boolean
		}
	} else if (type.flags & ts.TypeFlags.Never) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Never
		}
	} else if (type.flags & ts.TypeFlags.Null) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Null
		}
	} else if (type.flags & ts.TypeFlags.Number) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Number
		}
	} else if (type.flags & ts.TypeFlags.String) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.String
		}
	} else if (type.flags & ts.TypeFlags.Void) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Void
		}
	} else if (type.flags & ts.TypeFlags.NonPrimitive) {
		return {
			kind: ReflectionKind.Type,
			typeKind: TypeKind.Object
		}
	}
}
