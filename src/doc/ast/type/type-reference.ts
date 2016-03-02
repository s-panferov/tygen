import {
    TypeReferenceNode,
    TypeReference
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode
} from '../type';

import {
    extractTypeReference
} from '../type-utils';

import { Context,  Item, ItemType } from '../../index';

export interface TypeReferenceReflection extends TypeReflection {
    ref: string;
    typeName?: string;
    targetType?: TypeReflection;
    typeArguments?: TypeReflection[];
}

export function isTypeReferenceReflection(item: Item): item is TypeReferenceReflection {
    return item.itemType == ItemType.TypeReference;
}

export function visitTypeReference(
    node: TypeReferenceNode,
    type: TypeReference,
    ctx: Context
): TypeReferenceReflection {
    let targetType = type.target;
    // FIXME @spanferov create visitType that returns ref, e.g. getTypeRef

    let targetTypeRef = targetType
        && targetType !== type
        && extractTypeReference(targetType, ctx);

    let id = ctx.id(type);
    ctx.include(!targetTypeRef ? id : null);

    return {
        // if we have targetType — it's generic that has own id and can be referenced
        id: targetTypeRef ? id : ctx.id(node),
        ref: !targetTypeRef ? id : null,
        itemType: ItemType.TypeReference,
        typeName: node.typeName.getText(),
        targetType: targetTypeRef ? targetTypeRef : null,
        typeArguments: node.typeArguments &&
            node.typeArguments.map(ta => visitTypeNode(ta, ctx))
    };
}
