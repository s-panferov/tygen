import {
    TypeFlags,
    NodeFlags,
    SyntaxKind,
    NodeArray,
    TypeNode,
    TypeLiteralNode,
    UnionTypeNode,
    IntersectionTypeNode,
    Type,
    UnionType,
    IntersectionType,
    TypeElement,
    PropertySignature,
    TypeParameterDeclaration,
    ExpressionWithTypeArguments,
    LeftHandSideExpression,
    IndexSignatureDeclaration,
    ParameterDeclaration,
    CallSignatureDeclaration,
    TypeReferenceNode,
    TypeReference,
    MethodSignature,
    SignatureDeclaration,
    FunctionTypeNode,
    Signature,
    ClassElement,
    PropertyDeclaration,
    MethodDeclaration,
    ConstructorDeclaration,
    GetAccessorDeclaration,
    SetAccessorDeclaration,
} from 'typescript';

import {
    CoreType,
    getCoreType
} from '../tools';

import { Context } from '../index';
import { Item, ItemType } from '../items';

export interface PropertySignatureReflection extends Item {
    name: string;
    optional: boolean;
    type: TypeReflection;
}

export function isPropertySignatureReflection(item: Item): item is PropertySignatureReflection {
    return item.itemType == ItemType.PropertySignature;
}

export function isPropertySignature(node: TypeElement): node is PropertySignature {
    return node.kind == SyntaxKind.PropertySignature;
}

export function isConstructorDeclaration(elem: ClassElement): elem is ConstructorDeclaration {
    return elem.kind === SyntaxKind.Constructor;
}

export function isGetAccessorDeclaration(elem: ClassElement): elem is GetAccessorDeclaration {
    return elem.kind === SyntaxKind.GetAccessor;
}

export function isSetAccessorDeclaration(elem: ClassElement): elem is SetAccessorDeclaration {
    return elem.kind === SyntaxKind.SetAccessor;
}

export function isCallSignature(node: TypeElement): node is CallSignatureDeclaration {
    return node.kind == SyntaxKind.CallSignature;
}

export function isTypeReferenceNode(node: TypeNode): node is TypeReferenceNode {
    return node.kind == SyntaxKind.TypeReference;
}

export function isMethodSignature(node: TypeElement): node is MethodSignature {
    return node.kind == SyntaxKind.MethodSignature;
}

export function visitTypeElements(
    members: NodeArray<TypeElement>,
    ctx: Context
): Item[] {
    let reflections: Item[] = [];

    for (let [, member] of members.entries()) {
        if (isPropertySignature(member)) {
            reflections.push(
                visitPropertySignature(member, ctx)
            );
        } else if (isIndexSignatureDeclaration(member)) {
            reflections.push(
                visitIndexSignature(member, ctx)
            );
        } else if (isCallSignature(member)) {
            reflections.push(
                visitCallSignature(member, ctx)
            );
        } else if (isMethodSignature(member)) {
            reflections.push(
                visitMethodSignature(member, ctx)
            );
        }
    }

    return reflections;
}

export function isPropertyDeclaration(element: ClassElement): element is PropertyDeclaration {
    return element.kind == SyntaxKind.PropertyDeclaration;
}
export function isMethodDeclaration(element: ClassElement): element is MethodDeclaration {
    return element.kind == SyntaxKind.MethodDeclaration;
}

export function visitClassElements(
    members: NodeArray<ClassElement>,
    ctx: Context
): Item[] {
    let reflections: Item[] = [];

    for (let [, member] of members.entries()) {
        if (isPropertyDeclaration(member)) {
            reflections.push(
                visitPropertyDeclaration(member, ctx)
            );
        } else if (isMethodDeclaration(member)) {
            reflections.push(
                visitMethodDeclaration(member, ctx)
            );
        } else if (isConstructorDeclaration(member)) {
            reflections.push(
                visitConstructorDeclaration(member, ctx)
            );
        } else if (isGetAccessorDeclaration(member)) {
            reflections.push(
                visitGetAccessorDeclaration(member, ctx)
            );
        } else if (isSetAccessorDeclaration(member)) {
            reflections.push(
                visitSetAccessorDeclaration(member, ctx)
            );
        }
    }

    return reflections;
}

export function visitPropertySignature(
    prop: PropertySignature | PropertyDeclaration,
    ctx: Context
): PropertySignatureReflection {
    return {
        itemType: ItemType.PropertySignature,
        name: prop.name.getText(),
        optional: !!prop.questionToken,
        type: visitTypeNode(prop.type, ctx)
    } as PropertySignatureReflection;
}

export interface PropertyDeclarationReflection extends PropertySignatureReflection {

}

export function isPropertyDeclarationReflection(item: Item): item is PropertyDeclarationReflection {
    return item.itemType == ItemType.PropertyDeclaration;
}

export function visitPropertyDeclaration(
    prop: PropertyDeclaration,
    ctx: Context
): PropertyDeclarationReflection {
    let propertySig = visitPropertySignature(prop, ctx);
    return Object.assign(propertySig, {
        itemType: ItemType.PropertyDeclaration
    });
}

export function isIndexSignatureDeclaration(node: TypeElement): node is IndexSignatureDeclaration {
    return node.kind == SyntaxKind.IndexSignature;
}

export interface TypeReflection extends Item {

}

export interface TypeLiteralReflection extends TypeReflection {
    members: Item[];
}

export function isTypeLiteralReflection(item: Item): item is TypeLiteralReflection {
    return  item.itemType == ItemType.TypeLiteral;
}

export function isTypeLiteral(node: TypeNode): node is TypeLiteralNode {
    return node.kind == SyntaxKind.TypeLiteral;
}

export function isUnionTypeNode(node: TypeNode): node is UnionTypeNode {
    return node.kind == SyntaxKind.UnionType;
}

export function isIntersectionTypeNode(node: TypeNode): node is IntersectionTypeNode {
    return node.kind == SyntaxKind.IntersectionType;
}

export function isFunctionTypeNode(node: TypeNode): node is FunctionTypeNode {
    return node.kind == SyntaxKind.FunctionType;
}

export function matchCoreType(node: TypeNode): CoreType {
    switch(node.kind) {
        case SyntaxKind.StringKeyword: return CoreType.String;
        case SyntaxKind.BooleanKeyword: return CoreType.Boolean;
        case SyntaxKind.NumberKeyword: return CoreType.Number;
        case SyntaxKind.VoidKeyword: return CoreType.Void;
        case SyntaxKind.VoidKeyword: return CoreType.Void;
        case SyntaxKind.AnyKeyword: return CoreType.Any;
        default: return null;
    }
}

export function isStringKeyword(node: TypeNode): boolean {
    return node.kind == SyntaxKind.FunctionType;
}

export function visitTypeNode(node: TypeNode, ctx: Context): TypeReflection {
    let type = ctx.checker.getTypeAtLocation(node);

    if (isTypeLiteral(node)) {
        return visitTypeLiteral(node, type, ctx);
    }

    if (isUnionTypeNode(node)) {
        return visitUnionType(node, type as UnionType, ctx);
    }

    if (isIntersectionTypeNode(node)) {
        return visitIntersectionType(node, type as IntersectionType, ctx);
    }

    if (isTypeReferenceNode(node)) {
        return visitTypeReference(node, type as TypeReference, ctx);
    }

    if (isFunctionTypeNode(node)) {
        return visitFunctionTypeNode(node, type, ctx);
    }

    return extractTypeReference(type, ctx);
}

export interface CoreTypeReferenceReflection extends TypeReflection {
    coreType: CoreType;
}

export function extractTypeReference(type: Type, ctx: Context): TypeReflection {
    let coreType = getCoreType(type);
    if (coreType) {
        return {
            itemType: ItemType.CoreTypeReference,
            coreType
        } as CoreTypeReferenceReflection;
    } else {
        return {
            ref: ctx.id(type),
            itemType: ItemType.TypeReference,
        } as TypeReferenceReflection;
    }
}

export function visitTypeLiteral(node: TypeLiteralNode, type: Type, ctx: Context): TypeLiteralReflection {
    // TODO regiser inline types globally?

    return {
        id: ctx.id(type),
        itemType: ItemType.TypeLiteral,
        members: node.members && visitTypeElements(
            node.members,
            ctx
        )
    };
}

export interface IntersectionTypeReflection extends TypeReflection {
    types: TypeReflection[];
}

export function isIntersectionTypeReflection(item: Item): item is IntersectionTypeReflection {
    return item.itemType == ItemType.IntersectionType;
}

export interface UnionTypeReflection extends IntersectionTypeReflection {
    // The same as intersection
}

export function isUnionTypeReflection(item: Item): item is UnionTypeReflection {
    return item.itemType == ItemType.UnionType;
}

export function visitIntersectionType(
    node: IntersectionTypeNode,
    type: IntersectionType,
    ctx: Context
): IntersectionTypeReflection {
    // TODO regiser inline types globally?

    return {
        id: ctx.id(type),
        itemType: ItemType.IntersectionType,
        types: node.types.map((type) => visitTypeNode(type, ctx))
    };
}

export function visitUnionType(
    node: UnionTypeNode,
    type: Type,
    ctx: Context
): UnionTypeReflection {
    // TODO regiser inline types globally?

    return {
        id: ctx.id(type),
        itemType: ItemType.UnionType,
        types: node.types.map((type) => visitTypeNode(type, ctx))
    };
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

export interface TypeReferenceReflection extends TypeReflection {
    ref: string;
    typeName?: string;
    targetType?: TypeReflection;
    typeArguments?: TypeReflection[];
}

export function isTypeReferenceReflection(item: Item): item is TypeReferenceReflection {
    return item.itemType == ItemType.TypeReference;
}

export function isCoreTypeReferenceReflection(item: Item): item is CoreTypeReferenceReflection {
    return item.itemType == ItemType.CoreTypeReference;
}

export function visitTypeReference(
    node: TypeReferenceNode,
    type: TypeReference,
    ctx: Context
): TypeReferenceReflection {
    let targetType = type.target;
    // FIXME @spanferov create visitType that returns ref, e.g. getTypeRef

    let targetTypeRef = targetType
        && targetType !== type
        && extractTypeReference(targetType, ctx);

    let id = ctx.id(type);

    return {
        // if we have targetType — it's generic that has own id and can be referenced
        id: targetTypeRef ? id : null,
        ref: !targetTypeRef ? id : null,
        itemType: ItemType.TypeReference,
        typeName: node.typeName.getText(),
        targetType: targetTypeRef ? targetTypeRef : null,
        typeArguments: type.typeArguments &&
            node.typeArguments.map(ta => visitTypeNode(ta, ctx))
    };
}

export interface TypeParameterReflection extends Item {
    constraint: TypeReflection;
}

export function isTypeParameterReflection(item: Item): item is TypeParameterReflection {
    return item.itemType == ItemType.TypeParameter;
}

export function visitTypeParameter(decl: TypeParameterDeclaration, ctx: Context): TypeParameterReflection {
    let type = ctx.checker.getTypeAtLocation(decl);

    return {
        id: ctx.id(type),
        itemType: ItemType.TypeParameter,
        name: decl.name.text,
        constraint: decl.constraint && visitTypeNode(decl.constraint, ctx)
    };
}

export interface ExpressionWithTypeArgumentsReflection extends Item {
    expression: LeftHandSideExpressionReflection;
    typeArguments: TypeReflection[];
}

export function isExpressionWithTypeArgumentsReflection(item: TypeReflection): item is ExpressionWithTypeArgumentsReflection {
    return item.itemType == ItemType.ExpressionWithTypeArguments;
}

export function visitExpressionWithTypeArguments(expr: ExpressionWithTypeArguments, ctx: Context) {
    return {
        itemType: ItemType.ExpressionWithTypeArguments,
        typeArguments: expr.typeArguments &&
            expr.typeArguments.map(ta => visitTypeNode(ta, ctx)),
        expression: visitLeftHandSideExpression(expr.expression, ctx)
    };
}

export interface LeftHandSideExpressionReflection extends Item {
    type: TypeReflection;
}

export function visitLeftHandSideExpression(
    expr: LeftHandSideExpression,
    ctx: Context
): LeftHandSideExpressionReflection {
    let type = ctx.checker.getTypeAtLocation(expr);
    let symbol = type.getSymbol();
    let targetType = type;

    // FIXME @spanverov check for correctness
    if (type.flags & NodeFlags.HasExplicitReturn) {
        if (symbol.valueDeclaration) {
            targetType = ctx.checker.getTypeAtLocation(type.getSymbol().valueDeclaration);
        }
    }

    return {
        itemType: ItemType.LeftHandSideExpression,
        name: type.symbol.name,
        type: extractTypeReference(targetType, ctx)
    };
}

export interface ParameterReflection extends Item {
    name: string;
    optional: boolean;
    spread: boolean;
    type: TypeReflection;
}

export function isParameterReflection(item: Item): item is ParameterReflection {
    return item.itemType == ItemType.Parameter;
}

export function visitParameter(
    param: ParameterDeclaration,
    ctx: Context
): ParameterReflection {
    return {
        itemType: ItemType.Parameter,
        name: param.name.getText(),
        optional: !!param.questionToken,
        spread: !!param.dotDotDotToken,
        type: visitTypeNode(param.type, ctx)
    } as ParameterReflection;
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
    return {
        itemType: ItemType.Signature,
        name: sig.name && sig.name.getText(),
        typeParameters: sig.typeParameters &&
            sig.typeParameters.map(tp => visitTypeParameter(tp, ctx)),
        parameters: sig.parameters &&
            sig.parameters.map(p => visitParameter(p, ctx)),
        type: sig.type &&
            visitTypeNode(sig.type, ctx)
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
