import {
    ExpressionWithTypeArguments,
    LeftHandSideExpression,
    NodeFlags
} from 'typescript';

import {
    extractTypeReference
} from '../type-utils';

import { TypeReflection, visitTypeNode } from '../type';
import { Context,  Item, ItemType } from '../../index';

export interface ExpressionWithTypeArgumentsReflection extends Item {
    expression: LeftHandSideExpressionReflection;
    typeArguments: TypeReflection[];
}

export function isExpressionWithTypeArgumentsReflection(item: TypeReflection): item is ExpressionWithTypeArgumentsReflection {
    return item.itemType == ItemType.ExpressionWithTypeArguments;
}

export function visitExpressionWithTypeArguments(expr: ExpressionWithTypeArguments, ctx: Context): ExpressionWithTypeArgumentsReflection {
    return {
        selfRef: { id: ctx.id(expr) },
        itemType: ItemType.ExpressionWithTypeArguments,
        typeArguments: expr.typeArguments &&
            expr.typeArguments.map(ta => visitTypeNode(ta, ctx)),
        expression: visitLeftHandSideExpression(expr.expression, ctx)
    };
}

export interface LeftHandSideExpressionReflection extends Item {
    type: TypeReflection;
}

export function visitLeftHandSideExpression(
    expr: LeftHandSideExpression,
    ctx: Context
): LeftHandSideExpressionReflection {
    let type = ctx.checker.getTypeAtLocation(expr);
    let symbol = type.getSymbol();
    let targetType = type;

    // FIXME @spanverov check for correctness
    if (type.flags & NodeFlags.HasExplicitReturn) {
        if (symbol.valueDeclaration) {
            targetType = ctx.checker.getTypeAtLocation(type.getSymbol().valueDeclaration);
        }
    }

    return {
        selfRef: { id: ctx.id(expr) },
        itemType: ItemType.LeftHandSideExpression,
        name: expr.getText(),
        type: extractTypeReference(targetType, ctx)
    };
}
