import { Declaration, ClassDeclaration, SyntaxKind } from 'typescript'

import { Context } from '../index'
import { Item, ItemType } from '../items'

import { InterfaceReflection, visitBasicInfo } from './interface'

export interface ClassReflection extends InterfaceReflection {}

export function isClassReflection(item: Item): item is InterfaceReflection {
	return item.itemType === ItemType.Class
}

export function isClassDeclaration(statement: Declaration): statement is ClassDeclaration {
	return statement.kind === SyntaxKind.ClassDeclaration
}

export function visitClass(cls: ClassDeclaration, ctx: Context): ClassReflection {
	return ctx.dive(cls, () => {
		let basicInfo = visitBasicInfo(cls, ctx)

		return Object.assign(basicInfo, {
			itemType: ItemType.Class
		})
	})
}
