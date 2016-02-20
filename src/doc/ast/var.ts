import {
    Declaration,
    SyntaxKind,
    NodeFlags,
    VariableDeclaration,
    BindingElement
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode,
} from './type';

import {
    extractTypeReference,
} from './type-utils';

import { Context } from '../index';
import { Item, ItemType } from '../items';

export enum VariableDeclarationType {
    Var = 'var' as any,
    Const = 'const' as any,
    Let = 'let' as any,
}

export interface VariableDeclarationReflection extends Item {
    varType: VariableDeclarationType;
    type: TypeReflection;
    initializer: string;
}

export function isVariableDeclarationReflection(item: Item): item is VariableDeclarationReflection {
    return item.itemType == ItemType.VariableDeclaration;
}

export function isVariableDeclaration(statement: Declaration)
    : statement is VariableDeclaration
{
    return statement.kind == SyntaxKind.VariableDeclaration;
}

export function isBindingElement(statement: Declaration)
    : statement is BindingElement
{
    return statement.kind == SyntaxKind.BindingElement;
}

export function visitVariableDeclaration(
    variable: VariableDeclaration,
    ctx: Context
): VariableDeclarationReflection {
    let list = variable.parent;
    let varType = VariableDeclarationType.Var;
    if (list.flags & NodeFlags.Let) {
        varType = VariableDeclarationType.Let;
    } else if (list.flags & NodeFlags.Const) {
        varType = VariableDeclarationType.Const;
    }

    let type: TypeReflection;

    if (variable.type) {
        type = visitTypeNode(variable.type, ctx);
    } else {
        let checkerType = ctx.checker.getTypeAtLocation(variable);
        type = extractTypeReference(checkerType, ctx);
    }

    return {
        id: ctx.id(variable),
        name: variable.name.getText(),
        itemType: ItemType.VariableDeclaration,
        varType,
        type,
        initializer: variable.initializer &&
            variable.initializer.getText()
    } as VariableDeclarationReflection;
}

export function visitBindingElement(
    variable: BindingElement,
    ctx: Context
): VariableDeclarationReflection {

    let list = variable.parent;
    let varType = VariableDeclarationType.Var;
    if (list.flags & NodeFlags.Let) {
        varType = VariableDeclarationType.Let;
    } else if (list.flags & NodeFlags.Const) {
        varType = VariableDeclarationType.Const;
    }

    let type: TypeReflection;
    let checkerType = ctx.checker.getTypeAtLocation(variable);
    type = extractTypeReference(checkerType, ctx);

    return {
        id: ctx.id(variable),
        name: variable.name.getText(),
        itemType: ItemType.VariableDeclaration,
        varType,
        type,
        initializer: variable.initializer &&
            variable.initializer.getText()
    } as VariableDeclarationReflection;
}
