import {
    TypePredicateNode,
    Type
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode
} from '../type';

import { Context,  Item, ItemType } from '../../index';

export interface TypePredicateReflection extends TypeReflection {
    type: TypeReflection;
    parameterName: string;
}

export function isTypePredicateReflection(item: Item): item is TypePredicateReflection {
    return item.itemType == ItemType.TypePredicate;
}

export function visitTypePredicateNode(
    node: TypePredicateNode,
    type: Type,
    ctx: Context
): TypePredicateReflection {
    return {
        selfRef: { id: ctx.id(type.getSymbol() || type) },
        itemType: ItemType.TypePredicate,
        parameterName: node.parameterName.getText(),
        type: visitTypeNode(node.type, ctx)
    };
}
