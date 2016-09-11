import {
	TupleTypeNode,
	Type
} from 'typescript'

import {
	TypeReflection,
	visitTypeNode
} from '../type'

import { Context, Item, ItemType } from '../../index'

export interface TupleTypeReflection extends TypeReflection {
	elementTypes: TypeReflection[]
}

export function isTupleTypeReflection(item: Item): item is TupleTypeReflection {
	return item.itemType === ItemType.TupleType
}

export function visitTupleTypeNode(
	node: TupleTypeNode,
	type: Type,
	ctx: Context
): TupleTypeReflection {
	return {
		selfRef: { id: ctx.id(type.getSymbol() || type) },
		itemType: ItemType.TupleType,
		elementTypes: node.elementTypes.map(et => visitTypeNode(et, ctx))
	}
}
