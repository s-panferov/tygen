import { CoreType, getCoreType, inspect } from './tools';
import { DocItem, DocItemType } from './items';
import {
    Type,
    TypeFlags,
    SymbolFlags,
    UnionOrIntersectionType,
    ObjectType,
    Signature,
    TypeParameter,
    Symbol,
    ParameterDeclaration
} from 'typescript';

import * as _ from 'lodash';

import { DocContext } from './doc';

export interface TypeDoc extends DocItem {
    coreType?: CoreType;
}

export interface TypeParameterDoc extends DocItem {
    constraint: TypeDoc
}

export interface CallSignatureDoc extends DocItem {
    typeParameters: TypeParameterDoc[];
    parameters: ParameterDoc[];
    returnType: TypeDoc;
}

export interface TypeLiteralDoc extends DocItem {
    callSignatures: CallSignatureDoc[]
}

export interface ParameterDoc extends DocItem {
    rest: boolean,
    optional: boolean,
    type: TypeDoc,
    initializer: any
}

export interface UnionOrIntersectionTypeDoc extends DocItem {
    types: TypeDoc[];
}

export function visitType(type: Type, ctx: DocContext): TypeDoc {
    if (type.flags & TypeFlags.UnionOrIntersection) {
        return visitUnionOrIntersectionType(type as UnionOrIntersectionType, ctx);
    }

    if (type.symbol && type.symbol.flags & SymbolFlags.TypeLiteral) {
        return visitTypeLiteral(type, ctx);
    }

    // if (type.flags & TypeFlags.ObjectType) {
    //     return visitObjectType(type as ObjectType, ctx);
    // }

    let coreType = getCoreType(type);

    let typeDoc = {
        id: (type as any).id,
        itemType: DocItemType.Type,
        coreType
    }

    return typeDoc;
}

export function visitUnionOrIntersectionType(type: UnionOrIntersectionType, ctx: DocContext): UnionOrIntersectionTypeDoc {
    let typeDocs = type.types.map((type) => visitType(type, ctx));
    return {
        itemType: (type.flags & TypeFlags.Union)
            ? DocItemType.UnionType
            : DocItemType.IntersectionType,
        types: typeDocs
    }
}

export function visitObjectType(type: ObjectType, ctx: DocContext): any {
    return null
}

export function visitTypeLiteral(type: Type, ctx: DocContext): TypeLiteralDoc {
    let callSignatures = (type.getCallSignatures() || [])
        .map(signature => visitCallSignature(signature, ctx))

    return {
        itemType: DocItemType.TypeLiteral,
        callSignatures
    }
}

export function visitCallSignature(signature: Signature, ctx: DocContext): CallSignatureDoc {
    let typeParameters = (signature.getTypeParameters() || [])
        .map((parameter: TypeParameter) => visitTypeParameter(parameter, ctx));

    let parameters = (signature.parameters || [])
        .map((parameter) => visitParameter(parameter, ctx));

    let returnType = visitType(signature.getReturnType(), ctx);

    return {
        itemType: DocItemType.CallSignature,
        typeParameters,
        parameters,
        returnType
    }
}

export function visitTypeParameter(type: TypeParameter, ctx: DocContext): TypeParameterDoc {
    return {
        id: (type as any).id,
        itemType: DocItemType.TypeParameter,
        name: type.symbol.name,
        constraint: type.constraint && visitType(type.constraint, ctx)
    }
}

export function visitParameter(parameter: Symbol, ctx: DocContext): ParameterDoc {
    let parameterDeclaration = parameter.valueDeclaration as ParameterDeclaration;
    return {
        itemType: DocItemType.Parameter,
        name: parameter.name,
        optional: !!parameterDeclaration.questionToken,
        rest: !!parameterDeclaration.dotDotDotToken,
        type: visitType(ctx.checker.getTypeAtLocation(parameter.valueDeclaration), ctx),
        initializer: null
    }
}
