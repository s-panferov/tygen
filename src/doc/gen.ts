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
    SymbolFlags
} from 'typescript';

import * as typescript from 'typescript';

import { DocRuntime, DocContext } from './doc';
import { visitInterface } from './interface';
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
    }
}

export function visitSymbol(symbol: Symbol, ctx: DocContext) {
    // if (symbol.flags & SymbolFlags.) {

    // }
}
