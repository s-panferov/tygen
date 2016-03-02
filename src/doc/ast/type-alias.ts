import {
    Declaration,
    TypeAliasDeclaration,
    SyntaxKind
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode
} from './type';

import {
    TypeParameterReflection,
    visitTypeParameter,
} from './type/type-parameter';

import { Context } from '../index';
import { Item, ItemType } from '../items';

export interface TypeAliasDeclarationReflection extends Item {
    typeParameters: TypeParameterReflection[];
    type: TypeReflection;
}

export function isTypeAliasDeclarationReflection(item: Item): item is TypeAliasDeclarationReflection {
    return item.itemType == ItemType.TypeAlias;
}

export function isTypeAliasDeclaration(statement: Declaration)
    : statement is TypeAliasDeclaration
{
    return statement.kind == SyntaxKind.TypeAliasDeclaration;
}

export function visitTypeAliasDeclaration(
    alias: TypeAliasDeclaration,
    ctx: Context
): TypeAliasDeclarationReflection {
    let type = ctx.checker.getTypeAtLocation(alias);

    return {
        id: ctx.id(type),
        itemType: ItemType.TypeAlias,
        name: alias.name && alias.name.getText(),
        typeParameters: alias.typeParameters &&
            alias.typeParameters.map(tp => visitTypeParameter(tp, ctx)),
        type: visitTypeNode(alias.type, ctx)
    };
}
