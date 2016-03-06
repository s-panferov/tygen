import {
    Declaration,
    EnumDeclaration,
    EnumMember,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

import {
    InterfaceReflection,
    visitBasicInfo,
} from './interface';

export interface EnumDeclarationReflection extends InterfaceReflection {
    members?: EnumMemberReflection[];
}

export interface EnumMemberReflection extends Item {
    initializer: string;
}

export function isEnumDeclarationReflection(item: Item): item is EnumDeclarationReflection {
    return item.itemType == ItemType.EnumDeclaration;
}

export function isEnumDeclaration(statement: Declaration)
    : statement is EnumDeclaration
{
    return statement.kind == SyntaxKind.EnumDeclaration;
}

export function visitEnum(
    en: EnumDeclaration,
    ctx: Context
): EnumDeclarationReflection {
    let type = ctx.checker.getTypeAtLocation(en);
    let basicInfo = visitBasicInfo(en, ctx);

    return Object.assign(basicInfo, {
        id: ctx.id(type.getSymbol() || type),
        itemType: ItemType.EnumDeclaration,
        name: en.name && en.name.getText(),
        members: en.members
            && en.members.map(member => visitEnumMember(member, ctx)),
    });
}

export function visitEnumMember(member: EnumMember, ctx: Context): EnumMemberReflection {
    return {
        id: ctx.id(member),
        itemType: ItemType.EnumMember,
        name: member.name && member.name.getText(),
        initializer: member.initializer && member.initializer.getText()
    };
}
