import * as ts from 'typescript'

import { TypeReflectionBase, TypeKind, TypeReflection, visitType } from './type'
import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'

export interface MappedTypeReflection extends TypeReflectionBase {
	typeKind: TypeKind.Mapped
	typeParameter: TypeReflection
	templateType: TypeReflection
	constraintType: TypeReflection
}

export function visitMapped(type: ts.Type, ctx: Context): MappedTypeReflection {
	const reflection: MappedTypeReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.Mapped
	}

	ctx.registerType(type, reflection)

	debugger

	return reflection
}
