import {
    SourceFile,
    Symbol,
} from 'typescript';

import { Context } from './index';
import { visitTopLevelDeclarations } from './ast/declaration';

interface WithLocals {
    locals: {[key: string]: Symbol};
}

export function processSourceFile(source: SourceFile & WithLocals, ctx: Context) {
    let declarations: any[] = [];

    Object.keys(source.locals).forEach(symbolName => {
        let symbol = source.locals[symbolName];
        let declaration = symbol.declarations[0];
        declarations.push(declaration);
    });

    let [items] = visitTopLevelDeclarations(declarations, ctx);
    ctx.currentModule.items = items;
}
