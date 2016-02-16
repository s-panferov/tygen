import {
    SourceFile,
} from 'typescript';

import { Context } from './index';
import * as iface from './ast/interface';
import * as cls from './ast/class';
import * as en from './ast/enum';
import * as typeAlias from './ast/type-alias';

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
        } else if (en.isEnumDeclaration(statement)) {
            ctx.currentModule.items.push(
                en.visitEnum(statement, ctx)
            );
        } else if (typeAlias.isTypeAliasDeclaration(statement)) {
            ctx.currentModule.items.push(
                typeAlias.visitTypeAliasDeclaration(statement, ctx)
            );
        }
    });
}
