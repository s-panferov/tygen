import {
    Declaration,
    SyntaxKind,
    ModuleDeclaration,
    StringLiteral,
    Node
} from 'typescript';

import { Context } from '../index';

export function isModuleDeclaration(statement: Declaration)
    : statement is ModuleDeclaration
{
    return statement.kind == SyntaxKind.ModuleDeclaration;
}

export function isStringLiteral(statement: Node)
    : statement is StringLiteral
{
    return statement.kind == SyntaxKind.StringLiteral;
}

export function visitModuleDeclaration(
    module: ModuleDeclaration,
    ctx: Context
): void {
    let name = module.name;
    if (isStringLiteral(name)) {
        ctx.processInternalModule(name.text, module, true);
    } else {
        ctx.processInternalModule(name.text, module, false);
    }
}
