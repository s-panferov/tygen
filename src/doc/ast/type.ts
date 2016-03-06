import {
    SyntaxKind,
    NodeArray,
    TypeNode,
    UnionType,
    IntersectionType,
    Declaration,
    TypeReference,
} from 'typescript';

import {
    CoreType,
} from '../tools';

import {
    extractTypeReference
} from './type-utils';

import { Context } from '../index';
import { Item, ItemType } from '../items';
import * as nodeIs from './node-is';

import {
    visitPropertySignature,
    visitPropertyDeclaration,
} from './type/property';
import { visitFunctionDeclaration } from './type/function';
import {
    visitIndexSignature,
    visitCallSignature,
    visitMethodSignature,
    visitMethodDeclaration,
    visitConstructorDeclaration,
    visitGetAccessorDeclaration,
    visitSetAccessorDeclaration,
    visitFunctionTypeNode,
    visitConstructorTypeNode,
} from './type/signature';
import { visitTypeLiteral } from './type/type-literal';
import {
    visitUnionType,
    visitIntersectionType,
} from './type/intersection-union';
import {
    visitTypeReference,
} from './type/type-reference';
import {
    visitStringLiteralTypeNode,
} from './type/string-literal';
import { visitArrayTypeNode } from './type/array';
import { visitTupleTypeNode } from './type/tuple';
import { visitParenthesizedTypeNode } from './type/parenthesized';
import { visitTypePredicateNode } from './type/type-predicate';

export function visitDeclarations(
    members: NodeArray<Declaration>,
    ctx: Context
): Item[] {
    let reflections: Item[] = [];

    for (let [, member] of members.entries()) {
        if (nodeIs.isPropertySignature(member)) {
            reflections.push(
                visitPropertySignature(member, ctx)
            );
        } else if (nodeIs.isIndexSignatureDeclaration(member)) {
            reflections.push(
                visitIndexSignature(member, ctx)
            );
        } else if (nodeIs.isCallSignature(member)) {
            reflections.push(
                visitCallSignature(member, ctx)
            );
        } else if (nodeIs.isMethodSignature(member)) {
            reflections.push(
                visitMethodSignature(member, ctx)
            );
        } else if (nodeIs.isPropertyDeclaration(member)) {
            reflections.push(
                visitPropertyDeclaration(member, ctx)
            );
        } else if (nodeIs.isMethodDeclaration(member)) {
            reflections.push(
                visitMethodDeclaration(member, ctx)
            );
        } else if (nodeIs.isConstructorDeclaration(member)) {
            reflections.push(
                visitConstructorDeclaration(member, ctx)
            );
        } else if (nodeIs.isGetAccessorDeclaration(member)) {
            reflections.push(
                visitGetAccessorDeclaration(member, ctx)
            );
        } else if (nodeIs.isSetAccessorDeclaration(member)) {
            reflections.push(
                visitSetAccessorDeclaration(member, ctx)
            );
        } else if (nodeIs.isFunctionDeclaration(member)) {
            reflections.push(
                visitFunctionDeclaration(member, ctx)
            );
        }
    }

    return reflections;
}

export interface TypeMemberReflection {
    inherited: boolean;
    originId: string;
    originParentId: string;
}

export function visitInherenceInfo(item: Declaration, ctx: Context): TypeMemberReflection {
    let parentType = ctx.checker.getTypeAtLocation(item.parent);
    let symbol = parentType.getSymbol();
    let inherited = !ctx.inCurrentContext(symbol);

    return {
        inherited,
        originId: inherited ? ctx.id(item) : null,
        originParentId: inherited ? ctx.id(parentType) : null,
    };
}

export interface TypeReflection extends Item {

}

export interface StatementReflection extends Item {
    export: boolean;
    default: boolean;
}

export enum FieldFlag {
    Public = 'Public' as any,
    Private = 'Private' as any,
    Protected = 'Protected' as any,
}

export interface FieldReflection extends Item {
    flag?: FieldFlag;
    static: boolean;
    readonly: boolean;
    abstract: boolean;
}

export function matchCoreType(node: TypeNode): CoreType {
    switch(node.kind) {
        case SyntaxKind.StringKeyword: return CoreType.String;
        case SyntaxKind.BooleanKeyword: return CoreType.Boolean;
        case SyntaxKind.NumberKeyword: return CoreType.Number;
        case SyntaxKind.VoidKeyword: return CoreType.Void;
        case SyntaxKind.VoidKeyword: return CoreType.Void;
        case SyntaxKind.AnyKeyword: return CoreType.Any;
        case SyntaxKind.SymbolKeyword: return CoreType.Symbol;
        default: return null;
    }
}

export function visitTypeNode(node: TypeNode, ctx: Context): TypeReflection {
    let type = ctx.checker.getTypeAtLocation(node);

    let coreType = matchCoreType(node);
    if (coreType) {
        return {
            ref: ctx.id(type.getSymbol() || type),
            itemType: ItemType.CoreTypeReference,
            coreType
        } as CoreTypeReferenceReflection;
    }

    if (nodeIs.isTypeLiteral(node)) {
        return visitTypeLiteral(node, type, ctx);
    }

    if (nodeIs.isUnionTypeNode(node)) {
        return visitUnionType(node, type as UnionType, ctx);
    }

    if (nodeIs.isIntersectionTypeNode(node)) {
        return visitIntersectionType(node, type as IntersectionType, ctx);
    }

    if (nodeIs.isTypeReferenceNode(node)) {
        return visitTypeReference(node, type as TypeReference, ctx);
    }

    if (nodeIs.isFunctionTypeNode(node)) {
        return visitFunctionTypeNode(node, type, ctx);
    }

    if (nodeIs.isStringLiteralTypeNode(node)) {
        return visitStringLiteralTypeNode(node, type, ctx);
    }

    if (nodeIs.isConstructorTypeNode(node)) {
        return visitConstructorTypeNode(node, type, ctx);
    }

    if (nodeIs.isArrayTypeNode(node)) {
        return visitArrayTypeNode(node, type, ctx);
    }

    if (nodeIs.isTupleTypeNode(node)) {
        return visitTupleTypeNode(node, type, ctx);
    }

    if (nodeIs.isParenthesizedTypeNode(node)) {
        return visitParenthesizedTypeNode(node, type, ctx);
    }

    if (nodeIs.isTypePredicateNode(node)) {
        return visitTypePredicateNode(node, type, ctx);
    }

    console.warn('Unknown type node', node.kind, node.getText());
    return extractTypeReference(type, ctx);
}

export interface CoreTypeReferenceReflection extends TypeReflection {
    coreType: CoreType;
}

export function isCoreTypeReferenceReflection(item: Item): item is CoreTypeReferenceReflection {
    return item.itemType == ItemType.CoreTypeReference;
}
