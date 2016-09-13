import {
	TypeParameterDeclaration,
} from 'typescript'

import {
	TypeReflection,
	visitTypeNode
} from '../type'

import { Context, Item, ItemType } from '../../index'

export interface TypeParameterReflection extends Item {
	constraint: TypeReflection
}

export function isTypeParameterReflection(item: Item): item is TypeParameterReflection {
	return item.itemType === ItemType.TypeParameter
}

export function visitTypeParameter(decl: TypeParameterDeclaration, ctx: Context): TypeParameterReflection {
	let type = ctx.checker.getTypeAtLocation(decl)

	return {
		selfRef: { id: ctx.id(type.getSymbol() || type) },
		itemType: ItemType.TypeParameter,
		name: decl.name.text,
		constraint: decl.constraint && visitTypeNode(decl.constraint, ctx)
	}
}
