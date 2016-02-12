import {
    InterfaceDeclaration,
    ClassDeclaration,
    Statement,
    SyntaxKind,
    HeritageClause
} from 'typescript';

import * as assert from 'assert';

import { Context } from '../index';
import { Item, ItemType } from '../items';

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
    return item.itemType == ItemType.Interface;
}

export function isInterfaceDeclaration(statement: Statement)
    : statement is InterfaceDeclaration
{
    return statement.kind == SyntaxKind.InterfaceDeclaration;
}

export function visitBasicInfo(
    iface: InterfaceDeclaration | ClassDeclaration,
    ctx: Context
): InterfaceReflection {
    let type = ctx.checker.getTypeAtLocation(iface);

    assert.ok(type, 'Expect type to exist');

    let symbol = type.getSymbol();
    let comment = symbol.getDocumentationComment();

    return {
        id: ctx.id(type),
        name: iface.name.text,
        comment: comment && comment.map(c => c.text).join(''),
        typeParameters: iface.typeParameters &&
            iface.typeParameters.map(tp => visitTypeParameter(tp, ctx)),
        heritageClauses: iface.heritageClauses &&
            iface.heritageClauses.map(hc => visitHeritageClause(hc, ctx)),
        members: []
    };
}

export function visitInterface(
    iface: InterfaceDeclaration,
    ctx: Context
): InterfaceReflection {
    let basicInfo = visitBasicInfo(iface, ctx);

    return Object.assign(basicInfo, {
        itemType: ItemType.Interface,
        members: iface.members && visitTypeElements(
            iface.members,
            ctx
        )
    });
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
        itemType: ItemType.HeritageClause,
        clause: HeritageClauseTypeTsMapping[hc.token],
        types: hc.types &&
            hc.types.map(expr => visitExpressionWithTypeArguments(expr, ctx)),
    };
}
