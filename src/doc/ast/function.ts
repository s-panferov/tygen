import {
    FunctionDeclaration,
    Declaration,
    MethodSignature,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

import {
    InterfaceReflection,
    visitBasicInfo,
} from './interface';

import {
    TypeMemberReflection,
    visitInherenceInfo
} from './type';

export interface FunctionReflection extends InterfaceReflection {
}

export interface MethodReflection extends InterfaceReflection, TypeMemberReflection {

}

export function isFunctionReflection(item: Item): item is FunctionReflection {
    return item.itemType == ItemType.Function;
}

export function isMethodReflection(item: Item): item is MethodReflection {
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
    inherenceInfo: boolean,
    ctx: Context
): FunctionReflection {
    return ctx.dive(func, () => {
        let basicInfo = visitBasicInfo(func, ctx);

        if (inherenceInfo) {
            let inherenceInfo = visitInherenceInfo(func, ctx);
            return Object.assign(basicInfo, inherenceInfo, {
                selfRef: !inherenceInfo.inherited
                    ? basicInfo.selfRef
                    : Object.assign({}, basicInfo.selfRef, {
                        id: ctx.id()
                    }),
                itemType
            });
        } else {
            return Object.assign(basicInfo, {
                itemType
            });
        }
    });
}
