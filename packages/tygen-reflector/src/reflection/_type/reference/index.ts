import * as ts from 'typescript'

import { visitType } from '../index'
import { Context } from '../../../context'
import { TypeReferenceReflection } from './reflection'
import { visitSymbol } from '../../visitor'
import { ReflectionKind } from '../../reflection'
import { createLink } from '../../utils'
import { TypeReflection } from '../reflection'

export function visitReference(type: ts.TypeReference, ctx: Context): TypeReferenceReflection {
	const reflection: TypeReferenceReflection = {
		kind: ReflectionKind.TypeReference,
		target: undefined as any
	}

	ctx.registerType(type, reflection)

	if (type.symbol) {
		reflection.target = createLink(visitSymbol(type.symbol, ctx)!) as TypeReflection
	} else {
		reflection.target = visitType(type.target, ctx, {
			skipReference: type.target === type
		})! as TypeReflection
	}

	reflection.typeArguments =
		type.typeArguments &&
		type.typeArguments
			.map(arg => visitType(arg, ctx))
			// FIXME why do we have extra this type at the end?
			.filter(t => t.kind !== ReflectionKind.ThisType)

	return reflection
}
