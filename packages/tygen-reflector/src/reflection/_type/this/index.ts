import * as ts from 'typescript'

import { createLink, ReflectionLink, ReflectionKind } from '../../reflection'
import { Context } from '../../../context'
import { ThisReflection } from './reflection'
import { visitSymbol } from '../../visitor'

export function visitThis(type: ts.Type, ctx: Context): ThisReflection {
	let reflection: ThisReflection = {
		kind: ReflectionKind.ThisType
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
