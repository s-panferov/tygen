import {
    Declaration,
    IndexSignatureDeclaration,
    SignatureDeclaration,
    CallSignatureDeclaration,
    MethodSignature,
    MethodDeclaration,
    FunctionTypeNode,
    ConstructorDeclaration,
    GetAccessorDeclaration,
    SetAccessorDeclaration,
    Type,
    SyntaxKind
} from 'typescript';

import {
    TypeReflection,
    visitTypeNode,
} from '../type';

import {
    extractTypeReference
} from '../type-utils';

import {
    visitComment
} from '../comment';

import {
    visitParameter,
    ParameterReflection
} from './parameter';

import {
    visitTypeParameter,
    TypeParameterReflection
} from './type-parameter';

import { Context,  Item, ItemType } from '../../index';

export function isIndexSignatureDeclaration(node: Declaration): node is IndexSignatureDeclaration {
    return node.kind == SyntaxKind.IndexSignature;
}

export interface IndexSignatureReflection extends SignatureReflection {

}

export function isIndexSignatureReflection(item: Item): item is IndexSignatureReflection {
    return item.itemType == ItemType.IndexSignature;
}

export function visitIndexSignature(
    sig: IndexSignatureDeclaration,
    ctx: Context
): IndexSignatureReflection {
    return {
        id: ctx.id(sig),
        itemType: ItemType.IndexSignature,
        parameters: sig.parameters &&
            sig.parameters.map(p => visitParameter(p, ctx)),
        typeParameters: null,
        type: visitTypeNode(sig.type, ctx)
    } as IndexSignatureReflection;
}

export interface SignatureReflection extends Item {
    typeParameters: TypeParameterReflection[];
    parameters: ParameterReflection[];
    type: TypeReflection;
}

export function visitSignature(sig: SignatureDeclaration, ctx: Context): SignatureReflection {
    let returnType = sig.type && visitTypeNode(sig.type, ctx);
    let sigType = ctx.checker.getSignatureFromDeclaration(sig);
    if (!returnType) {
        // get return type from the checker
        let type = ctx.checker.getReturnTypeOfSignature(sigType);
        returnType = extractTypeReference(type, ctx);
    }

    return {
        id: ctx.id(sig),
        itemType: ItemType.Signature,
        name: sig.name && sig.name.getText(),
        typeParameters: sig.typeParameters &&
            sig.typeParameters.map(tp => visitTypeParameter(tp, ctx)),
        parameters: sig.parameters &&
            sig.parameters.map(p => visitParameter(p, ctx)),
        type: returnType,
        comment: visitComment(sig)
    } as SignatureReflection;
}

export interface CallSignatureReflection extends SignatureReflection {
}

export function isCallSignatureReflection(item: Item): item is IndexSignatureReflection {
    return item.itemType == ItemType.CallSignature;
}

export function visitCallSignature(
    sig: CallSignatureDeclaration,
    ctx: Context
): CallSignatureReflection {
    return Object.assign(visitSignature(sig, ctx), {
        itemType: ItemType.CallSignature
    });
}

export interface MethodSignatureReflection extends SignatureReflection {

}

export function isMethodSignatureReflection(item: Item): item is MethodSignatureReflection {
    return item.itemType == ItemType.MethodSignature;
}

export function visitMethodSignature(
    sig: MethodSignature,
    ctx: Context
): MethodSignatureReflection {
    return Object.assign(visitSignature(sig, ctx), {
        itemType: ItemType.MethodSignature
    });
}

export interface MethodDeclarationReflection extends SignatureReflection {

}

export function isMethodDeclarationReflection(item: Item): item is MethodSignatureReflection {
    return item.itemType == ItemType.MethodDeclaration;
}

export function visitMethodDeclaration(
    decl: MethodDeclaration,
    ctx: Context
): MethodDeclarationReflection {
    let signatureRefl = visitSignature(decl, ctx);

    return Object.assign(signatureRefl, {
        itemType: ItemType.MethodDeclaration,
    });
}

export interface ConstructorDeclarationReflection extends SignatureReflection {

}

export function isConstructorDeclarationReflection(item: Item): item is ConstructorDeclarationReflection {
    return item.itemType == ItemType.ConstructorDeclaration;
}

export function visitConstructorDeclaration(
    decl: ConstructorDeclaration,
    ctx: Context
): ConstructorDeclarationReflection {
    let signatureRefl = visitSignature(decl, ctx);

    return Object.assign(signatureRefl, {
        name: 'constructor',
        itemType: ItemType.ConstructorDeclaration,
    });
}

export interface GetAccessorDeclarationReflection extends SignatureReflection {

}

export function isGetAccessorDeclarationReflection(item: Item): item is GetAccessorDeclarationReflection {
    return item.itemType == ItemType.GetAccessorDeclaration;
}

export function visitGetAccessorDeclaration(
    decl: GetAccessorDeclaration,
    ctx: Context
): ConstructorDeclarationReflection {
    let signatureRefl = visitSignature(decl, ctx);

    return Object.assign(signatureRefl, {
        itemType: ItemType.GetAccessorDeclaration,
    });
}

export interface SetAccessorDeclarationReflection extends SignatureReflection {

}

export function isSetAccessorDeclarationReflection(item: Item): item is SetAccessorDeclarationReflection {
    return item.itemType == ItemType.SetAccessorDeclaration;
}

export function visitSetAccessorDeclaration(
    decl: SetAccessorDeclaration,
    ctx: Context
): SetAccessorDeclarationReflection {
    let signatureRefl = visitSignature(decl, ctx);

    return Object.assign(signatureRefl, {
        itemType: ItemType.SetAccessorDeclaration,
    });
}

export interface FunctionTypeReflection extends TypeReflection {
    signature: SignatureReflection;
}

export function isFunctionTypeReflection(item: Item): item is FunctionTypeReflection {
    return item.itemType == ItemType.FunctionType;
}

export function visitFunctionTypeNode(
    node: FunctionTypeNode,
    type: Type,
    ctx: Context
): FunctionTypeReflection {
    // TODO regiser inline types globally?

    return {
        id: ctx.id(type),
        itemType: ItemType.FunctionType,
        signature: visitSignature(node, ctx)
    };
}

export interface ConstructorTypeReflection extends SignatureReflection {
}

export function isConstructorTypeReflection(item: Item): item is ConstructorTypeReflection {
    return item.itemType == ItemType.ConstructorType;
}

export function visitConstructorTypeNode(
    node: FunctionTypeNode,
    type: Type,
    ctx: Context
): ConstructorTypeReflection {
    let signature = visitSignature(node, ctx);

    return Object.assign(signature, {
        name: 'new',
        id: ctx.id(node),
        itemType: ItemType.ConstructorType,
    });
}
