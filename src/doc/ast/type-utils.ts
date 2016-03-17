import { getCoreType } from '../tools';
import { ItemType } from '../items';
import { Type, SymbolFlags, TypeFlags, StringLiteralType, SyntaxKind } from 'typescript';
import { Context } from '../index';
import { logNode } from '../utils';
import {
    TypeReflection,
    CoreTypeReferenceReflection,
} from './type';

import {
    TypeReferenceReflection
} from './type/type-reference';

import {
    visitTypeLiteral,
} from './type/type-literal';

import {
    isTypeLiteral,
    isObjectLiteralExpression
} from './node-is';

import {
    StringLiteralTypeReflection,
} from './type/string-literal';

export function isStringLiteralType(type: Type): type is StringLiteralType {
    return !!(type.flags & TypeFlags.StringLiteral);
}

export function extractTypeReference(type: Type, ctx: Context): TypeReflection {
    let coreType = getCoreType(type);
    if (coreType) {
        return {
            selfRef: { id: ctx.id() },
            itemType: ItemType.CoreTypeReference,
            coreType
        } as CoreTypeReferenceReflection;
    } else {
        let symbol = type.symbol;
        if (symbol) {
            switch (true) {
                case !!(symbol.flags & SymbolFlags.Interface):
                case !!(symbol.flags & SymbolFlags.Class):
                case !!(symbol.flags & SymbolFlags.TypeAlias):
                case !!(symbol.flags & SymbolFlags.Function):
                case !!(symbol.flags & SymbolFlags.Enum):
                case !!(symbol.flags & SymbolFlags.TypeParameter):
                case !!(symbol.flags & SymbolFlags.ValueModule):
                case !!(symbol.flags & SymbolFlags.Method):
                    let id = ctx.id(symbol);
                    ctx.include(id);

                    if (symbol.declarations[0].kind == SyntaxKind.SourceFile) {
                        console.log(symbol);
                    }

                    let { pkg, path, mainId, semanticId, mainSemanticId } = ctx.routeForSym(symbol);
                    return {
                        ref: {
                            id,
                            pkg,
                            path,
                            semanticId,
                            mainSemanticId,
                            mainId
                        },
                        typeName: type.symbol.name,
                        itemType: ItemType.TypeReference,
                    } as TypeReferenceReflection;

                case !!(type.symbol.flags & SymbolFlags.TypeLiteral):
                case !!(type.symbol.flags & SymbolFlags.ObjectLiteral):
                    return extractTypeLiteral(type, ctx);

                default:
                    let err = 'Unknown symbol to extract reference from: ' + symbol.flags;
                    console.error(err, symbol);
                    throw new Error(err);
            }
        } else {
            if (isStringLiteralType(type)) {
                return extractStringLiteralType(type as any, ctx);
            }
        }
    }
}

export function extractTypeLiteral(type: Type, ctx: Context): TypeReflection {
    let node: any = type.symbol.declarations[0];
    let nodeType = ctx.checker.getTypeAtLocation(node);
    if (isTypeLiteral(node) || isObjectLiteralExpression(node)) {
        return visitTypeLiteral(node, nodeType, ctx);
    } else {
        console.log(type.symbol);
        logNode(node);
        console.log(node.parent.getText());
        throw new Error('declaration must be present in type literal');
    }
}

export function extractStringLiteralType(type: StringLiteralType, ctx: Context): StringLiteralTypeReflection {
    return {
        selfRef: { id: ctx.id(type.getSymbol() || type) },
        text: type.text
    };
}
