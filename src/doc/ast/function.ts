import {
    FunctionDeclaration,
    Declaration,
    MethodDeclaration,
    MethodSignature,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

import {
    InterfaceReflection,
    visitBasicInfo
} from './interface';

export interface FunctionReflection extends InterfaceReflection {
}

export function isFunctionReflection(item: Item): item is FunctionReflection {
    return item.itemType == ItemType.Function;
}

export function isMethodReflection(item: Item): item is FunctionReflection {
    return item.itemType == ItemType.Method;
}

export function isFunctionDeclaration(statement: Declaration)
    : statement is FunctionDeclaration
{
    return statement.kind == SyntaxKind.FunctionDeclaration;
}

export function isMethodDeclaration(statement: Declaration)
    : statement is FunctionDeclaration
{
    return statement.kind == SyntaxKind.MethodDeclaration;
}

export function isMethodSignature(statement: Declaration)
    : statement is FunctionDeclaration
{
    return statement.kind == SyntaxKind.MethodSignature;
}

export function visitFunctionLikeDeclaration(
    func: FunctionDeclaration | MethodSignature,
    itemType: ItemType,
    ctx: Context
): FunctionReflection {
    return ctx.dive(func.name.getText(), () => {
        let basicInfo = visitBasicInfo(func, ctx);
        return Object.assign(basicInfo, {
            itemType
        });
    });
}
