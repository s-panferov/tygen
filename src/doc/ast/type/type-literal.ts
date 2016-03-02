import {
    TypeLiteralNode,
    Type
} from 'typescript';

import {
    TypeReflection,
    visitDeclarations
} from '../type';

import { Context,  Item, ItemType } from '../../index';

export function isTypeLiteralReflection(item: Item): item is TypeLiteralReflection {
    return  item.itemType == ItemType.TypeLiteral;
}

export interface TypeLiteralReflection extends TypeReflection {
    members: Item[];
}

export function visitTypeLiteral(node: TypeLiteralNode, type: Type, ctx: Context): TypeLiteralReflection {
    // TODO regiser inline types globally?

    return {
        id: ctx.id(type),
        itemType: ItemType.TypeLiteral,
        members: node.members && visitDeclarations(
            node.members,
            ctx
        )
    };
}
