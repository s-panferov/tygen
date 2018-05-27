import ts from 'typescript'

import { ReflectionKind, createLink } from '../reflection'
import { Context } from '../../context'
import { visitSymbol } from '../visitor'
import { visitType } from '../_type'
import {
	SignatureReflection,
	ReflectionWithCallSignatures,
	ReflectionWithConstructSignatures,
	ReflectionWithIndexSignatures
} from './reflection'

import { TypeParameterReflection, ReflectionLink } from '..'

function signatureName(sig: ts.Signature) {
	const decl = sig.getDeclaration()
	const symbol: ts.Symbol | undefined = (decl as any).symbol
	if (symbol) {
		return symbol.name
	} else if (decl.name) {
		return decl.name.getText()
	} else {
		return '__call'
	}
}

export function visitSignature(sig: ts.Signature, ctx: Context): SignatureReflection {
	const signatureRef: SignatureReflection = {
		kind: ReflectionKind.Signature,
		parameters: [],
		returnType: createLink(visitType(sig.getReturnType(), ctx)),
		name: signatureName(sig)
	}

	if (sig.typeParameters) {
		sig.typeParameters.forEach(ty => {
			if (!signatureRef.typeParameters) {
				signatureRef.typeParameters = []
			}
			signatureRef.typeParameters.push(visitType(ty, ctx) as TypeParameterReflection)
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

	if (
		(ts.isMethodDeclaration(sig.declaration) || ts.isMethodSignature(sig.declaration)) &&
		sig.declaration.parent
	) {
		const parentSymbol = (sig.declaration.parent as any).symbol as ts.Symbol | undefined
		if (
			parentSymbol &&
			(parentSymbol.flags & ts.SymbolFlags.Interface ||
				parentSymbol.flags & ts.SymbolFlags.Class)
		) {
			const parentReflection = parentSymbol && visitSymbol(parentSymbol, ctx)
			const link = parentReflection && (createLink(parentReflection) as ReflectionLink)
			if (link) {
				signatureRef.origin = link
			}
		}
	}

	return signatureRef
}

export function visitCallSignatures(
	type: ts.Type,
	parent: ReflectionWithCallSignatures,
	ctx: Context
) {
	let otype = type as ts.InterfaceTypeWithDeclaredMembers

	// TODO strage place, why two?

	if (otype.declaredCallSignatures) {
		otype.declaredCallSignatures.forEach(signature => {
			if (!parent.ownCallSignatures) {
				parent.ownCallSignatures = []
			}
			let reflection = visitSignature(signature, ctx)
			parent.ownCallSignatures.push(reflection)
		})
	}

	const callSignatures = type.getCallSignatures()
	callSignatures.forEach(signature => {
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