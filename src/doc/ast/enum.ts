import {
    Statement,
    EnumDeclaration,
    EnumMember,
    SyntaxKind
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

export interface EnumDeclarationReflection extends Item {
    members?: EnumMemberReflection[];
}

export interface EnumMemberReflection extends Item {
    initializer: string;
}

export function isEnumDeclarationReflection(item: Item): item is EnumDeclarationReflection {
    return item.itemType == ItemType.EnumDeclaration;
}

export function isEnumDeclaration(statement: Statement)
    : statement is EnumDeclaration
{
    return statement.kind == SyntaxKind.EnumDeclaration;
}

export function visitEnum(
    en: EnumDeclaration,
    ctx: Context
): EnumDeclarationReflection {
    let type = ctx.checker.getTypeAtLocation(en);

    return {
        id: ctx.id(type),
        itemType: ItemType.EnumDeclaration,
        name: en.name && en.name.getText(),
        members: en.members
            && en.members.map(member => visitEnumMember(member, ctx)),
    };
}

export function visitEnumMember(member: EnumMember, ctx: Context): EnumMemberReflection {
    return {
        id: ctx.id(member),
        itemType: ItemType.EnumMember,
        name: member.name && member.name.getText(),
        initializer: member.initializer && member.initializer.getText()
    };
}
