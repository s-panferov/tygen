import {
    TypeReferenceNode,
    TypeReference,
    SyntaxKind,
    SymbolFlags,
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode
} from '../type';

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
    let symbol = ctx.checker.getSymbolAtLocation(node.typeName);

    // If this is an alias, and the request came at the declaration location
    // get the aliased symbol instead. This allows for goto def on an import e.g.
    //   import {A, B} from "mod";
    // to jump to the implementation directly.
    if (symbol.flags & SymbolFlags.Alias) {
        const declaration = symbol.declarations[0];

        // Go to the original declaration for cases:
        //
        //   (1) when the aliased symbol was declared in the location(parent).
        //   (2) when the aliased symbol is originating from a named import.
        //
        if (node.kind === SyntaxKind.Identifier &&
            (node.parent === declaration ||
            (declaration.kind === SyntaxKind.ImportSpecifier && declaration.parent && declaration.parent.kind === SyntaxKind.NamedImports))) {

            symbol = ctx.checker.getAliasedSymbol(symbol);
        }
    }

    let refId = ctx.id(symbol);
    ctx.include(refId);

    return {
        id: ctx.id(node),
        ref: refId,
        itemType: ItemType.TypeReference,
        typeName: node.typeName.getText(),
        typeArguments: node.typeArguments &&
            node.typeArguments.map(ta => visitTypeNode(ta, ctx))
    };
}
