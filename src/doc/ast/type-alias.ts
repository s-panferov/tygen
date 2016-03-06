import {
    Declaration,
    TypeAliasDeclaration,
    SyntaxKind,
    NodeFlags
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode,
    StatementReflection
} from './type';

import {
    TypeParameterReflection,
    visitTypeParameter,
} from './type/type-parameter';

import { Context } from '../index';
import { Item, ItemType } from '../items';

export interface TypeAliasDeclarationReflection extends Item, StatementReflection {
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
    let name = alias.name.getText();
    let symbol = (alias as any).symbol;

    if (!symbol) {
        throw new Error('no symbol');
    }

    return {
        id: ctx.id(symbol),
        semanticId: ctx.semanticId(name),
        export: !!(alias.flags & NodeFlags.Export),
        default: !!(alias.flags & NodeFlags.Default),
        itemType: ItemType.TypeAlias,
        name,
        typeParameters: alias.typeParameters &&
            alias.typeParameters.map(tp => visitTypeParameter(tp, ctx)),
        type: visitTypeNode(alias.type, ctx)
    };
}
