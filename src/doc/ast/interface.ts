import {
    InterfaceDeclaration,
    Statement,
    SyntaxKind,
    HeritageClause
} from 'typescript';

import * as assert from 'assert';

import { Context } from '../index';
import { Item, RefType } from '../items';

import {
    visitTypeElements,
    TypeParameterReflection,
    visitTypeParameter,
    visitExpressionWithTypeArguments,
    ExpressionWithTypeArgumentsReflection,
} from './type';

export interface InterfaceReflection extends Item {
    members: Item[];
    typeParameters?: TypeParameterReflection[];
    heritageClauses?: HeritageClauseReflection[];
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

    // console.log(iface.members[0]);

    return {
        id: ctx.id(type),
        name: iface.name.text,
        refType: RefType.Interface,
        typeParameters: iface.typeParameters &&
            iface.typeParameters.map(tp => visitTypeParameter(tp, ctx)),
        members: iface.members && visitTypeElements(
            iface.members,
            ctx
        ),
        heritageClauses: iface.heritageClauses &&
            iface.heritageClauses.map(hc => visitHeritageClause(hc, ctx))
    };
}

export enum HeritageClauseType {
    Extends = 'extends' as any,
    Implements = 'implements' as any,
}

export var HeritageClauseTypeTsMapping: { [ key: number ]: HeritageClauseType } = {
    [ SyntaxKind.ExtendsKeyword ]: HeritageClauseType.Extends,
    [ SyntaxKind.ImplementsKeyword ]: HeritageClauseType.Implements
};

export interface HeritageClauseReflection extends Item {
    clause: HeritageClauseType;
    types: ExpressionWithTypeArgumentsReflection[];
}

function visitHeritageClause(hc: HeritageClause, ctx: Context): HeritageClauseReflection {
    return {
        refType: RefType.HeritageClause,
        clause: HeritageClauseTypeTsMapping[hc.token],
        types: hc.types &&
            hc.types.map(expr => visitExpressionWithTypeArguments(expr, ctx)),
    };
}
