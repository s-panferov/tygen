import {
	IntersectionTypeNode,
	IntersectionType,
	UnionTypeNode,
	Type
} from 'typescript'

import { TypeReflection, visitTypeNode } from '../type'
import { Context, Item, ItemType } from '../../index'

export interface IntersectionTypeReflection extends TypeReflection {
	types: TypeReflection[]
}

export function isIntersectionTypeReflection(item: Item): item is IntersectionTypeReflection {
	return item.itemType === ItemType.IntersectionType
}

export interface UnionTypeReflection extends IntersectionTypeReflection {
	// The same as intersection
}

export function isUnionTypeReflection(item: Item): item is UnionTypeReflection {
	return item.itemType === ItemType.UnionType
}

export function visitIntersectionType(
	node: IntersectionTypeNode,
	type: IntersectionType,
	ctx: Context
): IntersectionTypeReflection {
	// TODO regiser inline types globally?

	return {
		selfRef: { id: ctx.id(type.getSymbol() || type) },
		itemType: ItemType.IntersectionType,
		types: node.types.map((type) => visitTypeNode(type, ctx))
	}
}

export function visitUnionType(
	node: UnionTypeNode,
	type: Type,
	ctx: Context
): UnionTypeReflection {
	// TODO regiser inline types globally?

	return {
		selfRef: { id: ctx.id(type.getSymbol() || type) },
		itemType: ItemType.UnionType,
		types: node.types.map((type) => visitTypeNode(type, ctx))
	}
}
