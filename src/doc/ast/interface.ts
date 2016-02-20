import {
    InterfaceDeclaration,
    ClassDeclaration,
    ModuleDeclaration,
    FunctionDeclaration,
    EnumDeclaration,
    InterfaceType,
    Declaration,
    SyntaxKind,
    MethodSignature,
    HeritageClause,
    TypeFlags,
    IndexSignatureDeclaration
} from 'typescript';

import { Context } from '../index';
import { Item, ItemType } from '../items';

import {
    TypeParameterReflection,
    visitTypeParameter,
    visitExpressionWithTypeArguments,
    ExpressionWithTypeArgumentsReflection,
    isIndexSignatureDeclaration,
    CallSignatureReflection,
    ConstructorDeclarationReflection,
    IndexSignatureReflection
} from './type';

import {
    isClassDeclaration,
} from './class';

import {
    visitDeclarations
} from './type';

import {
    visitTopLevelDeclarations
} from './declaration';

export interface InterfaceReflection extends Item {
    properties: Item[];
    callSignatures: CallSignatureReflection[];
    constructSignatures: ConstructorDeclarationReflection[];
    indexSignatures?: IndexSignatureReflection[];
    typeParameters?: TypeParameterReflection[];
    heritageClauses?: HeritageClauseReflection[];
}

export function isInterfaceReflection(item: Item): item is InterfaceReflection {
    return item.itemType == ItemType.Interface;
}

export function isInterfaceDeclaration(statement: Declaration)
    : statement is InterfaceDeclaration
{
    return statement.kind == SyntaxKind.InterfaceDeclaration;
}

export function visitBasicInfo(
    base: InterfaceDeclaration | ClassDeclaration | FunctionDeclaration | EnumDeclaration | ModuleDeclaration | MethodSignature,
    ctx: Context
): InterfaceReflection {
    let type = ctx.checker.getTypeAtLocation(base) as InterfaceType;

    let typeParameters = type.typeParameters &&
        type.typeParameters.map(tp => {
            return visitTypeParameter(tp.symbol.declarations[0] as any, ctx);
        });

    let typeHeritageClauses: HeritageClause[] = [];
    let symbol = type.getSymbol();
    let declarations = type.symbol.getDeclarations();
    let typeIndexSignatures: IndexSignatureDeclaration[] = [];

    (declarations as any).forEach((declaration: Declaration) => {
        ctx.visit(declaration);

        if (isInterfaceDeclaration(declaration) || isClassDeclaration(declaration)) {
            typeHeritageClauses = typeHeritageClauses.concat(declaration.heritageClauses || []);
            (declaration.members.forEach as any)(member => {
                if (isIndexSignatureDeclaration(member)) {
                    typeIndexSignatures.push(member);
                }
            });
        }
    });

    let heritageClauses = typeHeritageClauses
        .map(clause => {
            return visitHeritageClause(clause, ctx);
        });

    let typeProperties = type.getProperties().map(prop => {
        return prop.declarations[0];
    });

    let typeCallSignatures = type.getCallSignatures().map(sig => {
        return sig.declaration;
    });

    let typeConstructSignatures = type.getConstructSignatures().map(sig => {
        return sig.declaration;
    });

    let [properties, restDeclarations] = visitTopLevelDeclarations(typeProperties as any, ctx);
    properties = properties.concat(visitDeclarations(restDeclarations as any, ctx));

    let callSignatures = visitDeclarations(typeCallSignatures as any, ctx);
    let constructSignatures = visitDeclarations(typeConstructSignatures as any, ctx);
    let indexSignatures = visitDeclarations(typeIndexSignatures as any, ctx);

    let comment = symbol.getDocumentationComment();

    let itemType = ItemType.Interface;
    if (type.flags & TypeFlags.Class) {
        itemType = ItemType.Class;
    }

    return {
        id: ctx.id(type),
        semanticId: ctx.semanticId(),
        itemType,
        name: base.name.getText(),
        typeParameters,
        heritageClauses,
        callSignatures: callSignatures as any,
        indexSignatures: indexSignatures as any,
        constructSignatures: constructSignatures as any,
        properties,
        comment: comment && comment.map(c => c.text).join(''),
    };
}

export function visitInterface(
    iface: InterfaceDeclaration,
    ctx: Context
): InterfaceReflection {
    return ctx.dive(iface.name.text, () => {
        let basicInfo = visitBasicInfo(iface, ctx);

        return Object.assign(basicInfo, {
        });
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
        id: ctx.id(hc),
        itemType: ItemType.HeritageClause,
        clause: HeritageClauseTypeTsMapping[hc.token],
        types: hc.types &&
            hc.types.map(expr => visitExpressionWithTypeArguments(expr, ctx)),
    };
}
