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
