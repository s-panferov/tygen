import {
    SyntaxKind,
    NodeArray,
    PropertyDeclaration,
    TypeNode,
    TypeLiteralNode,
    UnionTypeNode,
    IntersectionTypeNode,
    Type,
    UnionType,
    IntersectionType,
    TypeElement,
    PropertySignature
} from 'typescript';

import {
    CoreType,
    getCoreType
} from '../tools';

import { Context } from '../index';
import { Item, RefType } from '../items';

export interface MemberReflection extends Item {
    name: string;
    optional: boolean;
    type: TypeReflection;
}

export function visitTypeElements(
    members: NodeArray<TypeElement>,
    ctx: Context
): MemberReflection[] {
    let reflections: MemberReflection[] = [];

    for (let [, member] of members.entries()) {
        if (isPropertySignature(member)) {
            reflections.push({
                refType: RefType.PropertySignature,
                name: member.name.getText(),
                optional: !!member.questionToken,
                type: visitTypeNode(member.type, ctx)
            });
        }
    }

    return reflections;
}

export function isPropertySignature(node: TypeElement): node is PropertySignature {
    return node.kind == SyntaxKind.PropertySignature;
}

export interface TypeReflection extends Item {
    coreType: CoreType;
}

export interface TypeLiteralReflection extends TypeReflection {
    members: MemberReflection[];
}

export function isTypeLiteralReflection(item: Item): item is TypeLiteralReflection {
    return  item.refType == RefType.TypeLiteral;
}

export function isTypeLiteral(node: TypeNode): node is TypeLiteralNode {
    return node.kind == SyntaxKind.TypeLiteral;
}

export function isUnionTypeNode(node: TypeNode): node is UnionTypeNode {
    return node.kind == SyntaxKind.UnionType;
}

export function isIntersectionTypeNode(node: TypeNode): node is IntersectionTypeNode {
    return node.kind == SyntaxKind.IntersectionType;
}

export function visitTypeNode(node: TypeNode, ctx: Context): TypeReflection {
    let type = ctx.checker.getTypeAtLocation(node);

    if (isTypeLiteral(node)) {
        return visitTypeLiteral(node, type, ctx);
    }

    if (isUnionTypeNode(node)) {
        return visitUnionType(node, type as UnionType, ctx);
    }

    if (isIntersectionTypeNode(node)) {
        return visitIntersectionType(node, type as IntersectionType, ctx);
    }

    return visitType(type, ctx);
}

export function visitType(type: Type, ctx: Context): TypeReflection {
    return {
        id: ctx.id(type),
        coreType: getCoreType(type)
    };
}

export function visitTypeLiteral(node: TypeLiteralNode, type: Type, ctx: Context): TypeLiteralReflection {
    // TODO regiser inline types globally?

    let reflection = visitType(type, ctx);
    return Object.assign(reflection, {
        refType: RefType.TypeLiteral,
        members: visitTypeElements(
            node.members,
            ctx
        )
    });
}

export interface IntersectionTypeReflection extends TypeReflection {
    types: TypeReflection[];
}

export function isIntersectionTypeReflection(item: Item): item is IntersectionTypeReflection {
    return item.refType == RefType.IntersectionType;
}

export interface UnionTypeReflection extends IntersectionTypeReflection {
    // The same as intersection
}

export function isUnionTypeReflection(item: Item): item is UnionTypeReflection {
    return item.refType == RefType.UnionType;
}

export function visitIntersectionType(
    node: IntersectionTypeNode,
    type: IntersectionType,
    ctx: Context
): IntersectionTypeReflection {
    // TODO regiser inline types globally?

    let reflection = visitType(type, ctx);

    return Object.assign(reflection, {
        refType: RefType.IntersectionType,
        types: node.types.map((type) => visitTypeNode(type, ctx))
    });
}

export function visitUnionType(
    node: UnionTypeNode,
    type: Type,
    ctx: Context
): UnionTypeReflection {
    // TODO regiser inline types globally?

    let reflection = visitType(type, ctx);

    return Object.assign(reflection, {
        refType: RefType.UnionType,
        types: node.types.map((type) => visitTypeNode(type, ctx))
    });
}
