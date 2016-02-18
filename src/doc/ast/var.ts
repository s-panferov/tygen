import {
    Statement,
    VariableStatement,
    SyntaxKind,
    NodeFlags
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

export function isVariableStatement(statement: Statement)
    : statement is VariableStatement
{
    return statement.kind == SyntaxKind.VariableStatement;
}

export function visitVariableStatement(
    variable: VariableStatement,
    ctx: Context
): VariableDeclarationReflection[] {
    let list = variable.declarationList;
    let varType = VariableDeclarationType.Var;
    if (list.flags & NodeFlags.Let) {
        varType = VariableDeclarationType.Let;
    } else if (list.flags & NodeFlags.Const) {
        varType = VariableDeclarationType.Const;
    }

    return list.declarations.map(variable => {
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
    });
}
