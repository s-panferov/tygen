import ts from 'typescript'

import { ReflectionKind } from '../reflection'
import { createLink } from '../utils'
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
import { visitTypeParameters } from '../interface'
import { visitModifiers } from '../class'

function signatureName(sig: ts.Signature) {
	const decl = sig.getDeclaration()
	const symbol: ts.Symbol | undefined = (decl as any).symbol
	if (decl && decl.name) {
		return decl.name.getText()
	} else if (symbol && symbol.name) {
		return symbol.name
	} else {
		return '__call'
	}
}

export function visitSignature(sig: ts.Signature, ctx: Context): SignatureReflection {
	const signatureRef: SignatureReflection = {
		kind: ReflectionKind.Signature,
		parameters: [],
		returnType: visitType(sig.getReturnType(), ctx),
		name: signatureName(sig)
	}

	visitModifiers(sig, mod => {
		if (mod.kind === ts.SyntaxKind.StaticKeyword) {
			signatureRef.static = true
		} else if (mod.kind === ts.SyntaxKind.AbstractKeyword) {
			signatureRef.abstract = true
		}
	})

	if (sig.typeParameters) {
		visitTypeParameters(sig.typeParameters, signatureRef, ctx)
	}

	sig.parameters.forEach(parameter => {
		const reflection = visitSymbol(parameter, ctx)
		if (reflection) {
			signatureRef.parameters.push(reflection)
		}
	})

	const comment = sig.getDocumentationComment(ctx.checker)
	if (comment.length > 0) {
		signatureRef.comments = comment
	}

	const tags = sig.getJsDocTags()
	if (tags.length > 0) {
		signatureRef.tags = tags
	}

	const declaration = sig.declaration

	if (
		declaration &&
		(ts.isMethodDeclaration(declaration) || ts.isMethodSignature(declaration)) &&
		declaration.parent
	) {
		const parentSymbol = (declaration.parent as any).symbol as ts.Symbol | undefined
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
	const callSignatures = type.getCallSignatures()
	callSignatures.forEach(signature => {
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
