/// <reference path="../../node_modules/typescript/lib/typescript.d.ts" />

import {
    InterfaceDeclaration,
    SyntaxKind,
    TypeChecker,
    SourceFile,
    Symbol,
    Node,
    Type,
    TypeFlags,
    SymbolFlags,
    FunctionDeclaration
} from 'typescript';

import * as typescript from 'typescript';

import { DocRuntime, DocContext } from './doc';
import { visitInterface } from './interface';
import { visitFunction } from './function';
import { DocItem } from './items';

export function processSourceFile(source: SourceFile, ctx: DocContext) {
    source.statements.forEach(statement => {
        ctx.doc.items.push(
            visitType(ctx.checker.getTypeAtLocation(statement), ctx)
        )
    });
}

export function visitType(type: Type, ctx: DocContext): DocItem {
    if (type.flags & TypeFlags.Interface) {
        return visitInterface(type as any, ctx)
    } else if (type.flags & TypeFlags.Anonymous) {
        return visitAnonymousType(type, ctx);
    }
}

export function visitSymbol(symbol: Symbol, ctx: DocContext) {
    // if (symbol.flags & SymbolFlags.) {

    // }
}

export function visitAnonymousType(type: Type, ctx: DocContext): DocItem {
    let symbol = type.symbol;
    if (symbol.flags & SymbolFlags.Function) {
        return visitFunction(type, ctx);
    }

    return null;
}
