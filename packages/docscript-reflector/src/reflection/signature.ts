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
import { TypeReflection, visitType, TypeReflectionBase } from './type/type'

export interface ReflectionWithCallSignatures {
	ownCallSignatures?: SignatureReflection[]
	allCallSignatures?: (ReflectionLink | SignatureReflection)[]
}

export interface ReflectionWithConstructSignatures {
	constructSignatures?: SignatureReflection[]
}

export interface ReflectionWithIndexSignatures {
	numberIndexType?: TypeReflection
	stringIndexType?: TypeReflection
}

export interface SignatureReflection extends BaseReflection {
	kind: ReflectionKind.Signature
	parameters: Reflection[]
	typeParameters?: Reflection[]
	returnType: Reflection
}

export function visitSignature(sig: ts.Signature, ctx: Context): SignatureReflection {
	const signatureRef: SignatureReflection = {
		kind: ReflectionKind.Signature,
		parameters: [],
		returnType: visitType(sig.getReturnType(), ctx)
	}

	if (sig.typeParameters) {
		sig.typeParameters.forEach(ty => {
			if (!signatureRef.typeParameters) {
				signatureRef.typeParameters = []
			}
			signatureRef.typeParameters.push(visitType(ty, ctx))
		})
	}

	sig.parameters.forEach(parameter => {
		const reflection = visitSymbol(parameter, ctx)
		if (reflection) {
			signatureRef.parameters.push(reflection)
		}
	})

	let comment = sig.getDocumentationComment(ctx.checker)
	if (comment.length > 0) {
		signatureRef.comments = comment
	}

	let directive = sig.getJsDocTags()
	if (directive.length > 0) {
		signatureRef.directives = directive
	}

	return signatureRef
}

export interface FunctionScopedVariableReflection extends BaseReflection {
	kind: ReflectionKind.FunctionScopedVariable
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

	ts.ObjectFlags

	return variableRef
}

export function visitCallSignatures(
	type: ts.Type,
	parent: ReflectionWithCallSignatures,
	ctx: Context
) {
	let otype = type as ts.InterfaceTypeWithDeclaredMembers

	if (otype.declaredCallSignatures) {
		otype.declaredCallSignatures.forEach(signature => {
			if (!parent.ownCallSignatures) {
				parent.ownCallSignatures = []
			}
			let reflection = visitSignature(signature, ctx)
			parent.ownCallSignatures.push(reflection)
		})
	}

	type.getCallSignatures().forEach(signature => {
		if (!parent.allCallSignatures) {
			parent.allCallSignatures = []
		}
		let reflection = visitSignature(signature, ctx)
		parent.allCallSignatures.push(createLink(reflection))
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
