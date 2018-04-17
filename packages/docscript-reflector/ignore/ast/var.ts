import { Declaration, SyntaxKind, NodeFlags, VariableDeclaration, BindingElement } from 'typescript'

import { TypeReflection, visitTypeNode, StatementReflection, isExported } from './type'

import { extractTypeReference } from './type-utils'

import { Context } from '../index'
import { Item, ItemType } from '../items'

export enum VariableDeclarationType {
	Var = 'var' as any,
	Const = 'const' as any,
	Let = 'let' as any
}

export interface VariableDeclarationReflection extends Item, StatementReflection {
	varType: VariableDeclarationType
	type: TypeReflection
	initializer: string
}

export function isVariableDeclarationReflection(item: Item): item is VariableDeclarationReflection {
	return item.itemType === ItemType.VariableDeclaration
}

export function isVariableDeclaration(statement: Declaration): statement is VariableDeclaration {
	return statement.kind === SyntaxKind.VariableDeclaration
}

export function isBindingElement(statement: Declaration): statement is BindingElement {
	return statement.kind === SyntaxKind.BindingElement
}

export function visitVariableDeclaration(
	variable: VariableDeclaration,
	ctx: Context
): VariableDeclarationReflection {
	let list = variable.parent
	let varType = VariableDeclarationType.Var
	if (list.flags & NodeFlags.Let) {
		varType = VariableDeclarationType.Let
	} else if (list.flags & NodeFlags.Const) {
		varType = VariableDeclarationType.Const
	}

	let type: TypeReflection

	if (variable.type) {
		type = visitTypeNode(variable.type, ctx)
	} else {
		let checkerType = ctx.checker.getTypeAtLocation(variable)
		type = extractTypeReference(checkerType, ctx)
	}

	let id = ctx.id(variable)
	let name = variable.name.getText()
	return {
		selfRef: {
			id,
			semanticId: ctx.semanticId(id, name),
			pkg: ctx.currentModule.pkgName,
			path: ctx.currentModule.fileInfo.relativeToPackage,
			mainSemanticId: ctx.mainId()
		},
		name,
		itemType: ItemType.VariableDeclaration,
		exported: isExported(list.parent),
		default: !!(list.parent.flags & NodeFlags.Default),
		varType,
		type,
		initializer: variable.initializer && variable.initializer.getText()
	}
}

export function visitBindingElement(
	variable: BindingElement,
	ctx: Context
): VariableDeclarationReflection {
	let list = variable.parent
	let varType = VariableDeclarationType.Var
	if (list.flags & NodeFlags.Let) {
		varType = VariableDeclarationType.Let
	} else if (list.flags & NodeFlags.Const) {
		varType = VariableDeclarationType.Const
	}

	let type: TypeReflection
	let checkerType = ctx.checker.getTypeAtLocation(variable)
	type = extractTypeReference(checkerType, ctx)

	let id = ctx.id(variable)
	let name = variable.name.getText()
	return {
		selfRef: {
			id,
			semanticId: ctx.semanticId(id, name),
			pkg: ctx.currentModule.pkgName,
			path: ctx.currentModule.fileInfo.relativeToPackage,
			mainSemanticId: ctx.mainId()
		},
		name,
		itemType: ItemType.VariableDeclaration,
		exported: isExported(list.parent),
		default: !!(list.parent.flags & NodeFlags.Default),
		varType,
		type,
		initializer: variable.initializer && variable.initializer.getText()
	}
}
