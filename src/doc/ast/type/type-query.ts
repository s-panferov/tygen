import {
    TypeQueryNode,
    Type
} from 'typescript';

import {
    TypeReflection,
} from '../type';

import {
    extractRefFromNode
} from './type-reference';

import {
    isIdentifier
} from '../node-is';

import { Context,  Item, ItemType, Ref } from '../../index';

export interface TypeQueryReflection extends TypeReflection {
    ref: Ref;
    exprName: string;
}

export function isTypeQueryReflection(item: Item): item is TypeQueryReflection {
    return item.itemType == ItemType.TypeQuery;
}

export function visitTypeQueryNode(
    node: TypeQueryNode,
    type: Type,
    ctx: Context
): TypeQueryReflection {
    let ref: Ref;
    let exprName = node.exprName;
    if (isIdentifier(exprName)) {
        if (typeof exprName.originalKeywordKind !== 'undefined') {
            ref = null;
        } else {
            ref = extractRefFromNode(node.exprName, ctx);
        }
    } else {
        ref = extractRefFromNode(node.exprName, ctx);
    }

    return {
        selfRef: { id: ctx.id(node) },
        ref,
        exprName: node.exprName.getText(),
        itemType: ItemType.TypeQuery,
    };
}
