import { getCoreType } from '../tools';
import { ItemType } from '../items';
import { Type, SymbolFlags } from 'typescript';
import { Context} from '../index';
import {
    TypeReflection,
    CoreTypeReferenceReflection,
    TypeReferenceReflection,
    visitTypeLiteral,
    isTypeLiteral
} from './type';

export function extractTypeReference(type: Type, ctx: Context): TypeReflection {
    let coreType = getCoreType(type);
    if (coreType) {
        return {
            itemType: ItemType.CoreTypeReference,
            coreType
        } as CoreTypeReferenceReflection;
    } else {
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
    }
}

export function extractTypeLiteral(type: Type, ctx: Context): TypeReflection {
    let node: any = type.symbol.declarations[0];
    let nodeType = ctx.checker.getTypeAtLocation(node);
    if (isTypeLiteral(node)) {
        return visitTypeLiteral(node, nodeType, ctx);
    } else {
        throw new Error('declaration must be present in type literal');
    }
}
