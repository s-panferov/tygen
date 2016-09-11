import {
	FunctionDeclaration,
} from 'typescript'

import { SignatureReflection, visitSignature } from './signature'
import { Context, Item, ItemType } from '../../index'

export interface FunctionDeclarationReflection extends SignatureReflection {
	generator: boolean
}

export function isFunctionDeclarationReflection(item: Item): item is FunctionDeclarationReflection {
	return item.itemType == ItemType.FunctionDeclaration
}

export function visitFunctionDeclaration(
	func: FunctionDeclaration,
	ctx: Context
): FunctionDeclarationReflection {
	let signature = visitSignature(func, ctx)
	return Object.assign(signature, {
		itemType: ItemType.FunctionDeclaration,
		generator: !!func.asteriskToken
	})
}
