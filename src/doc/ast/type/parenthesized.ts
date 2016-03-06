import {
    ParenthesizedTypeNode,
    Type
} from 'typescript';

import { TypeReflection, visitTypeNode } from '../type';
import { Context,  Item, ItemType } from '../../index';

export interface ParenthesizedTypeReflection extends TypeReflection {
    type: TypeReflection;
}

export function isParenthesizedTypeReflection(item: Item): item is ParenthesizedTypeReflection {
    return item.itemType == ItemType.ParenthesizedType;
}

export function visitParenthesizedTypeNode(
    node: ParenthesizedTypeNode,
    type: Type,
    ctx: Context
): ParenthesizedTypeReflection {
    return {
        id: ctx.id(type.getSymbol() || type),
        itemType: ItemType.ParenthesizedType,
        type: visitTypeNode(node.type, ctx)
    };
}
