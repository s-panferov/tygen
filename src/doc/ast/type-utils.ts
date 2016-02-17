import { getCoreType } from '../tools';
import { ItemType } from '../items';
import { Type, SymbolFlags, TypeFlags, StringLiteralType } from 'typescript';
import { Context } from '../index';
import { logNode } from '../utils';
import {
    TypeReflection,
    CoreTypeReferenceReflection,
    TypeReferenceReflection,
    visitTypeLiteral,
    StringLiteralTypeReflection,
    isTypeLiteral
} from './type';

export function isStringLiteralType(type: Type): type is StringLiteralType {
    return !!(type.flags & TypeFlags.StringLiteral);
}

export function extractTypeReference(type: Type, ctx: Context): TypeReflection {
    let coreType = getCoreType(type);
    if (coreType) {
        return {
            itemType: ItemType.CoreTypeReference,
            coreType
        } as CoreTypeReferenceReflection;
    } else {
        let symbol = type.symbol;
        if (symbol) {
            switch (true) {
                case !!(type.symbol.flags & SymbolFlags.Interface):
                case !!(type.symbol.flags & SymbolFlags.Class):
                case !!(type.symbol.flags & SymbolFlags.TypeAlias):
                case !!(type.symbol.flags & SymbolFlags.Enum):
                case !!(type.symbol.flags & SymbolFlags.TypeParameter):
                    return {
                        ref: ctx.id(type),
                        typeName: type.symbol.name,
                        itemType: ItemType.TypeReference,
                    } as TypeReferenceReflection;

                case !!(type.symbol.flags & SymbolFlags.TypeLiteral):
                    return extractTypeLiteral(type, ctx);
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
    if (isTypeLiteral(node)) {
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
        id: ctx.id(type),
        text: type.text
    };
}
