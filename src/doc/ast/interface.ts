import {
    InterfaceDeclaration,
    Statement,
    SyntaxKind,
    NodeArray,
    PropertyDeclaration,
    TypeNode,
    TypeLiteralNode,
    UnionTypeNode,
    IntersectionTypeNode
} from 'typescript';

import {
    CoreType,
    getCoreType
} from '../tools';

import * as assert from 'assert';

import { Context } from '../index';
import { Item } from '../items';
import { logNode } from '../utils';

export interface InterfaceReflection extends Item {
    id: string;
    name: string;
    members: any[];
    // typeParameters?: NodeArray<TypeParameterDeclaration>;
    // heritageClauses?: NodeArray<HeritageClause>;
    // members: NodeArray<Declaration>;
}

export function isInterfaceDeclaration(statement: Statement)
    : statement is InterfaceDeclaration
{
    return statement.kind == SyntaxKind.InterfaceDeclaration;
}

export function visitInterface(iface: InterfaceDeclaration, ctx: Context)
    : InterfaceReflection
{
    let type = ctx.checker.getTypeAtLocation(iface);

    assert.ok(type, 'Expect type to exist');

    return {
        id: ctx.id(type),
        name: iface.name.text,
        members: visitMembers(
            iface.members as NodeArray<PropertyDeclaration>,
            ctx
        )
    };
}

interface MemberReflection {
    name: string;
    optional: boolean;
    type: any;
}

export function visitMembers(members: NodeArray<PropertyDeclaration>, ctx: Context): any[] {
    let reflections: MemberReflection[] = [];
    for (let [, decl] of members.entries()) {
        reflections.push({
            name: decl.name.getText(),
            optional: !!decl.questionToken,
            type: visitMemberType(decl.type, ctx)
        });
    }

    return reflections;
}

interface TypeReflection {
    id: string;
    coreType: CoreType;
}

interface TypeLiteralReflection extends TypeReflection {
    members: MemberReflection[];
}

function isTypeLiteral(node: TypeNode): node is TypeLiteralNode {
    return node.kind == SyntaxKind.TypeLiteral;
}

function isUnionType(node: TypeNode): node is UnionTypeNode {
    return node.kind == SyntaxKind.UnionType;
}

function isIntersectionType(node: TypeNode): node is IntersectionTypeNode {
    return node.kind == SyntaxKind.IntersectionType;
}

export function visitMemberType(node: TypeNode, ctx: Context): TypeReflection {
    let type = ctx.checker.getTypeAtLocation(node);

    let reflection: TypeReflection = {
        id: ctx.id(type),
        coreType: getCoreType(type)
    };

    if (isTypeLiteral(node)) {
        return Object.assign(reflection, {
            members: visitMembers(
                node.members as NodeArray<PropertyDeclaration>,
                ctx
            )
        });
    }

    if (isIntersectionType(node)) {
        
    }

    return reflection;
}
