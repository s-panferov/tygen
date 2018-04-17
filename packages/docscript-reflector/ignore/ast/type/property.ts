import { PropertySignature, PropertyDeclaration } from 'typescript'

import { TypeReflection, visitTypeNode, TypeMemberReflection, visitInherenceInfo } from '../type'

import { extractTypeReference } from '../type-utils'

import { visitComment } from '../comment'

import { Context, Item, ItemType } from '../../index'

export function isPropertySignatureReflection(item: Item): item is PropertySignatureReflection {
	return item.itemType === ItemType.PropertySignature
}

export interface PropertySignatureReflection extends Item, TypeMemberReflection {
	name: string
	optional: boolean
	type: TypeReflection
}

export function visitPropertySignature(
	prop: PropertySignature | PropertyDeclaration,
	ctx: Context
): PropertySignatureReflection {
	let name = prop.name.getText()
	let inherenceInfo = visitInherenceInfo(prop, ctx)

	let type = prop.type
		? visitTypeNode(prop.type, ctx)
		: extractTypeReference(ctx.checker.getTypeAtLocation(prop), ctx)

	let id = inherenceInfo.inherited ? ctx.id() : ctx.id(prop)
	return Object.assign(inherenceInfo, {
		selfRef: {
			id,
			semanticId: ctx.semanticId(id, name),
			pkg: ctx.currentModule.pkgName,
			path: ctx.currentModule.fileInfo.relativeToPackage,
			mainSemanticId: ctx.mainId()
		},
		itemType: ItemType.PropertySignature,
		name,
		optional: !!prop.questionToken,
		type,
		comment: visitComment(prop)
	}) as PropertySignatureReflection
}

export interface PropertyDeclarationReflection extends PropertySignatureReflection {}

export function isPropertyDeclarationReflection(item: Item): item is PropertyDeclarationReflection {
	return item.itemType === ItemType.PropertyDeclaration
}

export function visitPropertyDeclaration(
	prop: PropertyDeclaration,
	ctx: Context
): PropertyDeclarationReflection {
	let propertySig = visitPropertySignature(prop, ctx)
	return Object.assign(propertySig, {
		itemType: ItemType.PropertyDeclaration
	})
}
