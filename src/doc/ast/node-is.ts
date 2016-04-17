import {
    Node,
    SyntaxKind,
    TypeNode,
    TypeLiteralNode,
    UnionTypeNode,
    IntersectionTypeNode,
    Declaration,
    PropertySignature,
    CallSignatureDeclaration,
    TypeReferenceNode,
    MethodSignature,
    FunctionTypeNode,
    PropertyDeclaration,
    MethodDeclaration,
    ConstructorDeclaration,
    GetAccessorDeclaration,
    SetAccessorDeclaration,
    StringLiteralTypeNode,
    IndexSignatureDeclaration,
    ConstructorTypeNode,
    ArrayTypeNode,
    TupleTypeNode,
    ParenthesizedTypeNode,
    FunctionDeclaration,
    TypePredicateNode,
    ObjectLiteralExpression,
    TypeQueryNode,
    Identifier
} from 'typescript';

export function isPropertySignature(node: Declaration): node is PropertySignature {
    return node.kind == SyntaxKind.PropertySignature;
}

export function isConstructorDeclaration(elem: Declaration): elem is ConstructorDeclaration {
    return elem.kind === SyntaxKind.Constructor;
}

export function isGetAccessorDeclaration(elem: Declaration): elem is GetAccessorDeclaration {
    return elem.kind === SyntaxKind.GetAccessor;
}

export function isSetAccessorDeclaration(elem: Declaration): elem is SetAccessorDeclaration {
    return elem.kind === SyntaxKind.SetAccessor;
}

export function isCallSignature(node: Declaration): node is CallSignatureDeclaration {
    return node.kind == SyntaxKind.CallSignature;
}

export function isTypeReferenceNode(node: TypeNode): node is TypeReferenceNode {
    return node.kind == SyntaxKind.TypeReference;
}

export function isMethodSignature(node: Declaration): node is MethodSignature {
    return node.kind == SyntaxKind.MethodSignature;
}

export function isTypeLiteral(node: TypeNode): node is TypeLiteralNode {
    return node.kind == SyntaxKind.TypeLiteral;
}

export function isObjectLiteralExpression(node: Declaration): node is ObjectLiteralExpression {
    return node.kind == SyntaxKind.ObjectLiteralExpression;
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

export function isStringLiteralTypeNode(node: TypeNode): node is StringLiteralTypeNode {
    return node.kind == SyntaxKind.StringLiteralType;
}

export function isConstructorTypeNode(node: TypeNode): node is ConstructorTypeNode {
    return node.kind == SyntaxKind.ConstructorType;
}

export function isArrayTypeNode(node: TypeNode): node is ArrayTypeNode {
    return node.kind == SyntaxKind.ArrayType;
}

export function isTupleTypeNode(node: TypeNode): node is TupleTypeNode {
    return node.kind == SyntaxKind.TupleType;
}

export function isParenthesizedTypeNode(node: TypeNode): node is ParenthesizedTypeNode {
    return node.kind == SyntaxKind.ParenthesizedType;
}

export function isTypePredicateNode(node: TypeNode): node is TypePredicateNode {
    return node.kind == SyntaxKind.TypePredicate;
}

export function isPropertyDeclaration(element: Declaration): element is PropertyDeclaration {
    return element.kind == SyntaxKind.PropertyDeclaration;
}

export function isMethodDeclaration(element: Declaration): element is MethodDeclaration {
    return element.kind == SyntaxKind.MethodDeclaration;
}

export function isStringKeyword(node: TypeNode): boolean {
    return node.kind == SyntaxKind.FunctionType;
}

export function isIndexSignatureDeclaration(node: Declaration): node is IndexSignatureDeclaration {
    return node.kind == SyntaxKind.IndexSignature;
}

export function isTypeQueryNode(node: TypeNode): node is TypeQueryNode {
    return node.kind == SyntaxKind.TypeQuery;
}

export function isIdentifier(node: Node): node is Identifier {
    return node.kind == SyntaxKind.Identifier;
}

export function isFunctionDeclaration(statement: Declaration)
    : statement is FunctionDeclaration
{
    return statement.kind == SyntaxKind.FunctionDeclaration;
}
