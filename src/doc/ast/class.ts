import {
    Statement,
    ClassDeclaration,
    InterfaceDeclaration,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, RefType } from '../items';

import {
    InterfaceReflection,
    visitBasicInfo,
} from './interface';

import {
    visitClassElements
} from './type';

export interface ClassReflection extends InterfaceReflection {

}

export function isClassReflection(item: Item): item is InterfaceReflection {
    return item.refType == RefType.Class;
}

export function isClasDeclaration(statement: Statement)
    : statement is ClassDeclaration
{
    return statement.kind == SyntaxKind.ClassDeclaration;
}

export function visitClass(
    cls: ClassDeclaration,
    ctx: Context
): ClassReflection {
    let basicInfo = visitBasicInfo(cls, ctx);

    return Object.assign(basicInfo, {
        refType: RefType.Class,
        members: cls.members && visitClassElements(
            cls.members,
            ctx
        )
    });
}
