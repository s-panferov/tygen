import ts from 'typescript'

import { ReflectionKind } from '../reflection'
import { Context } from '../../context'
import { symbolId } from '../identifier'
import { visitType } from '../_type'
import { VariableReflection, ParameterReflection } from './reflection'
import { filterUndefined } from '../property'

export function isParameter(symbol: ts.Symbol) {
	if (symbol.declarations) {
		return ts.isParameter(symbol.declarations[0])
	} else {
		return false
	}
}

export function visitVariable(
	symbol: ts.Symbol,
	ctx: Context
): VariableReflection | ParameterReflection {
	let variableRef: VariableReflection | ParameterReflection

	if (isParameter(symbol)) {
		const decl = symbol.declarations![0]!
		let rest = false
		let question = false

		if (ts.isParameter(decl)) {
			rest = !!decl.dotDotDotToken
			question = !!decl.questionToken
		}

		variableRef = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.Parameter,
			name: symbol.name,
			type: undefined as any,
			rest,
			question
		}
	} else {
		variableRef = {
			id: symbolId(symbol, ctx),
			kind: ReflectionKind.Variable,
			name: symbol.name,
			type: undefined as any
		}
	}

	ctx.registerSymbol(symbol, variableRef)

	let type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	variableRef.type = filterUndefined(visitType(type, ctx))

	return variableRef
}
