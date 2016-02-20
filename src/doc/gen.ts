import {
    SourceFile,
    Symbol,
} from 'typescript';

import { Context } from './index';
import { Item } from './items';
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

    let indexed = {} as {[id: string]: Item};
    let [items] = visitTopLevelDeclarations(declarations, ctx);

    items.forEach(item => {
        if (!item.id) {
            console.error(item);
            throw new Error('item dont have id');
        }
        indexed[item.id] = item;
    });

    ctx.currentModule.items = indexed;
}
