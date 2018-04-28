import ts from 'typescript'

import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'
import { symbolId } from '../identifier'
import { visitType } from '../_type'
import { VariableReflection } from './reflection'

export function visitVariable(symbol: ts.Symbol, ctx: Context): VariableReflection {
	let variableRef: VariableReflection = {
		id: symbolId(symbol, ctx),
		kind: ReflectionKind.Variable,
		name: symbol.name,
		type: undefined as any
	}

	ctx.registerSymbol(symbol, variableRef)

	let type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	variableRef.type = createLink(visitType(type, ctx))

	return variableRef
}
