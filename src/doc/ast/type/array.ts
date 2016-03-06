import {
    ArrayTypeNode,
    Type
} from 'typescript';

import { TypeReflection, visitTypeNode } from '../type';
import { Context,  Item, ItemType } from '../../index';

export interface ArrayTypeReflection extends TypeReflection {
    elementType: TypeReflection;
}

export function isArrayTypeReflection(item: Item): item is ArrayTypeReflection {
    return item.itemType == ItemType.ArrayType;
}

export function visitArrayTypeNode(
    node: ArrayTypeNode,
    type: Type,
    ctx: Context
): ArrayTypeReflection {
    return {
        id: ctx.id(type.getSymbol() || type),
        itemType: ItemType.ArrayType,
        elementType: visitTypeNode(node.elementType, ctx)
    };
}
