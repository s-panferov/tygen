import {
	ParameterDeclaration,
} from 'typescript'

import {
	extractTypeReference
} from '../type-utils'

import { TypeReflection, visitTypeNode } from '../type'
import { Context, Item, ItemType } from '../../index'

export interface ParameterReflection extends Item {
	name: string
	optional: boolean
	spread: boolean
	type: TypeReflection
}

export function isParameterReflection(item: Item): item is ParameterReflection {
	return item.itemType === ItemType.Parameter
}

export function visitParameter(
	param: ParameterDeclaration,
	ctx: Context
): ParameterReflection {
	let paramType = param.type && visitTypeNode(param.type, ctx)
	if (!paramType) {
		let type = ctx.checker.getTypeAtLocation(param)
		paramType = extractTypeReference(type, ctx)
	}

	return {
		selfRef: { id: ctx.id(param) },
		itemType: ItemType.Parameter,
		name: param.name.getText(),
		optional: !!param.questionToken,
		spread: !!param.dotDotDotToken,
		type: paramType
	} as ParameterReflection
}
