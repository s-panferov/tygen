import {
    Type,
    FunctionDeclaration
} from 'typescript';
import { DocItem, DocItemType } from './items';
import { CallSignatureDoc, visitCallSignature } from './type';
import { DocContext } from './doc';

export interface FunctionDoc extends DocItem {
    callSignatures: CallSignatureDoc[];
}

export function visitFunction(func: Type, ctx: DocContext): FunctionDoc {
    let callSignatures = (func.getCallSignatures() || [])
        .map((signature) => visitCallSignature(signature, ctx));

    return {
        id: (func as any).id,
        itemType: DocItemType.Function,
        name: func.symbol.name,
        callSignatures
    };
}
