import * as ts from 'typescript'

import { visitType } from '../index'
import { Context } from '../../../context'
import { MappedTypeReflection } from './reflection'
import { ReflectionKind } from '../../reflection'

export interface MappedType extends ts.Type {
	declaration: ts.MappedTypeNode
	typeParameter: ts.Type
	constraintType: ts.Type
}

export function visitMapped(type: ts.Type, ctx: Context): MappedTypeReflection {
	const reflection: MappedTypeReflection = {
		kind: ReflectionKind.MappedType,
		typeParameter: undefined as any,
		templateType: undefined as any,
		constraintType: undefined as any
	}

	let mappedType = type as MappedType

	ctx.registerType(type, reflection)

	// FIXME mapped type structure is somewhat strange in TypeScript
	if ((type as any).target) {
		mappedType = (type as any).target
	}

	if (mappedType.typeParameter) {
		reflection.typeParameter = visitType(mappedType.typeParameter, ctx)
	} else {
		throw new Error('Mapped type should have a type parameter')
	}

	if (mappedType.constraintType) {
		reflection.constraintType = visitType(mappedType.constraintType, ctx)
	} else {
		throw new Error('Mapped type should have type a constraintType')
	}

	let template = mappedType.declaration.type
	if (template) {
		let templateType = ctx.checker.getTypeAtLocation(template)
		if (templateType) {
			reflection.templateType = visitType(templateType, ctx)
		}
	}

	return reflection
}
