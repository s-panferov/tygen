import * as ts from 'typescript'

import { TypeKind } from '../reflection'
import { ReflectionKind, createLink, ReflectionLink } from '../../reflection'
import { Context } from '../../../context'
import { ThisReflection } from './reflection'
import { visitSymbol } from '../../visitor'

export function visitThis(type: ts.Type, ctx: Context): ThisReflection {
	let reflection: ThisReflection = {
		kind: ReflectionKind.Type,
		typeKind: TypeKind.This
	}

	if (type.symbol) {
		const symbolRef = visitSymbol(type.symbol, ctx)
		if (symbolRef) {
			reflection.base = createLink(symbolRef) as ReflectionLink
		}
	}

	ctx.registerType(type, reflection)
	return reflection
}
