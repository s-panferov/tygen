import {
    StringLiteralTypeNode,
    Type
} from 'typescript';

import {
    TypeReflection,
} from '../type';

import { Context,  Item, ItemType } from '../../index';

export interface StringLiteralTypeReflection extends TypeReflection {
    text: string;
}

export function isStringLiteralTypeReflection(item: Item): item is StringLiteralTypeReflection {
    return item.itemType == ItemType.StringLiteralType;
}

export function visitStringLiteralTypeNode(
    node: StringLiteralTypeNode,
    type: Type,
    ctx: Context
): StringLiteralTypeReflection {
    return {
        id: ctx.id(type),
        text: node.text,
        itemType: ItemType.StringLiteralType
    };
}
