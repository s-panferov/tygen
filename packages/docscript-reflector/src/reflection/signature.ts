import ts, { Expression, HeritageClause } from 'typescript'
import * as tg from 'tsutils/typeguard'

import {
	Reflection,
	ReflectionKind,
	ReflectionWithExports,
	BaseReflection,
	ReflectionLink,
	HasId,
	createLink
} from './reflection'
import { Context } from '../context'
import { visitSymbol } from './visitor'
import { TypeParameterReflection } from './type-parameter'
import { visitContainer } from './module'
import { isReachable } from './utils'
import { visitObjectProperties } from './interface'
import { TypeReflection, visitType } from './type/type'

export interface ReflectionWithCallSignatures {
	callSignatures?: SignatureReflection[]
}

export interface ReflectionWithConstructSignatures {
	constructSignatures?: SignatureReflection[]
}

export interface ReflectionWithIndexSignatures {
	numberIndexType?: TypeReflection
	stringIndexType?: TypeReflection
}

export interface SignatureReflection {
	parameters: Reflection[]
}

export function visitSignature(sig: ts.Signature, ctx: Context): SignatureReflection {
	const signatureRef: SignatureReflection = {
		parameters: []
	}

	sig.parameters.forEach(parameter => {
		const reflection = visitSymbol(parameter, ctx)
		if (reflection) {
			signatureRef.parameters.push(reflection)
		}
	})

	return signatureRef
}

export interface FunctionScopedVariableReflection extends BaseReflection {
	name: string
	type: TypeReflection
}

export function visitFunctionScopedVariable(
	symbol: ts.Symbol,
	ctx: Context
): FunctionScopedVariableReflection {
	const variableRef: FunctionScopedVariableReflection = {
		name: symbol.name,
		kind: ReflectionKind.FunctionScopedVariable,
		type: undefined as any
	}

	ctx.registerSymbol(symbol, variableRef)

	const type = ctx.checker.getTypeOfSymbolAtLocation(symbol, {} as any)
	variableRef.type = visitType(type, ctx)

	return variableRef
}

export function visitCallSignatures(
	type: ts.Type,
	parent: ReflectionWithCallSignatures,
	ctx: Context
) {
	type.getCallSignatures().forEach(signature => {
		if (!parent.callSignatures) {
			parent.callSignatures = []
		}
		let reflection = visitSignature(signature, ctx)
		parent.callSignatures.push(reflection)
	})
}

export function visitConstructSignatures(
	type: ts.Type,
	parent: ReflectionWithConstructSignatures,
	ctx: Context
) {
	type.getConstructSignatures().forEach(signature => {
		if (!parent.constructSignatures) {
			parent.constructSignatures = []
		}
		let reflection = visitSignature(signature, ctx)
		parent.constructSignatures.push(reflection)
	})
}

export function visitIndexSignatures(
	type: ts.Type,
	parent: ReflectionWithIndexSignatures,
	ctx: Context
) {
	let numberIndexType = type.getNumberIndexType()
	if (numberIndexType) {
		parent.numberIndexType = visitType(numberIndexType, ctx)
	}

	let stringIndexType = type.getStringIndexType()
	if (stringIndexType) {
		parent.numberIndexType = visitType(stringIndexType, ctx)
	}
}
