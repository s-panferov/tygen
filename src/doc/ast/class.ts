import {
    Statement,
    ClassDeclaration,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

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
    return item.itemType == ItemType.Class;
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
    return ctx.dive(cls.name.getText(), () => {
        let basicInfo = visitBasicInfo(cls, ctx);

        return Object.assign(basicInfo, {
            itemType: ItemType.Class,
            members: cls.members && visitClassElements(
                cls.members,
                ctx
            )
        });
    });
}
