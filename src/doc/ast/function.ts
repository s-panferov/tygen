import {
    FunctionDeclaration,
    Statement,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

import {
    SignatureReflection,
    visitSignature
} from './type';

export interface FunctionDeclarationReflection extends SignatureReflection {
    generator: boolean;
}

export function isFunctionDeclarationReflection(item: Item): item is FunctionDeclarationReflection {
    return item.itemType == ItemType.FunctionDeclaration;
}

export function isFunctionDeclaration(statement: Statement)
    : statement is FunctionDeclaration
{
    return statement.kind == SyntaxKind.FunctionDeclaration;
}

export function visitFunctionDeclaration(
    func: FunctionDeclaration,
    ctx: Context
): FunctionDeclarationReflection {
    let signature = visitSignature(func, ctx);
    return Object.assign(signature, {
        itemType: ItemType.FunctionDeclaration,
        name: func.name.getText(),
        generator: !!func.asteriskToken
    });
}
