import {
    Declaration,
    Signature,
    SymbolDisplayPart
} from 'typescript';

import {
    Context
} from '..';

function joinComment(doc: SymbolDisplayPart[]): string {
    return doc.map(c => c.text).join('');
}

export function visitCommentInSignature(sig: Signature, ctx): string {
    let docComment = sig.getDocumentationComment();
    if (docComment) {
        return joinComment(docComment);
    }
}

export function visitComment(node: Declaration, ctx: Context): string {
    let type = ctx.checker.getTypeAtLocation(node);
    if (type) {
        let symbol = type.getSymbol();
        if (symbol) {
            let docComment = symbol.getDocumentationComment();
            if (docComment) {
                return joinComment(docComment);
            }
        }
    }
}
