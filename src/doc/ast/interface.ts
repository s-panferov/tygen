import {
    InterfaceDeclaration,
    Statement,
    SyntaxKind,
    NodeArray,
    PropertyDeclaration,
} from 'typescript';

import * as assert from 'assert';

import { Context } from '../index';
import { Item, RefType } from '../items';

import {
    MemberReflection,
    visitMembers
} from './type';

export interface InterfaceReflection extends Item {
    members: MemberReflection[];
    // typeParameters?: NodeArray<TypeParameterDeclaration>;
    // heritageClauses?: NodeArray<HeritageClause>;
    // members: NodeArray<Declaration>;
}

export function isInterfaceReflection(item: Item): item is InterfaceReflection {
    return item.refType == RefType.Interface;
}

export function isInterfaceDeclaration(statement: Statement)
    : statement is InterfaceDeclaration
{
    return statement.kind == SyntaxKind.InterfaceDeclaration;
}

export function visitInterface(
    iface: InterfaceDeclaration,
    ctx: Context
): InterfaceReflection {
    let type = ctx.checker.getTypeAtLocation(iface);

    assert.ok(type, 'Expect type to exist');

    return {
        id: ctx.id(type),
        name: iface.name.text,
        refType: RefType.Interface,
        members: visitMembers(
            iface.members as NodeArray<PropertyDeclaration>,
            ctx
        )
    };
}
