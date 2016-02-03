import {
    SourceFile,
} from 'typescript';

import {
    SyntaxKind
} from 'typescript';

import * as typescript from 'typescript';

import { Context } from './index';
import * as iface from './ast/interface';
import * as cls from './ast/class';

export function processSourceFile(source: SourceFile, ctx: Context) {
    source.statements.forEach(statement => {
        if (iface.isInterfaceDeclaration(statement)) {
            ctx.currentModule.items.push(
                iface.visitInterface(statement, ctx)
            );
        } else if (cls.isClasDeclaration(statement)) {
            ctx.currentModule.items.push(
                cls.visitClass(statement, ctx)
            );
        }
    });
}
