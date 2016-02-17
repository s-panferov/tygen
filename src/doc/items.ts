export enum ItemType {
    Interface = 'Interface' as any,
    UnionType = 'UnionType' as any,
    IntersectionType = 'IntersectionType' as any,
    TypeLiteral = 'TypeLiteral' as any,
    PropertySignature = 'PropertySignature' as any,
    PropertyDeclaration = 'PropertyDeclaration' as any,
    TypeParameter = 'TypeParameter' as any,
    HeritageClause = 'HeritageClause' as any,
    ExpressionWithTypeArguments = 'ExpressionWithTypeArguments' as any,
    LeftHandSideExpression = 'LeftHandSideExpression' as any,
    IndexSignature = 'IndexSignature' as any,
    CallSignature = 'CallSignature' as any,
    Parameter = 'Parameter' as any,
    Signature = 'Signature' as any,
    CoreTypeReference = 'CoreTypeReference' as any, // synthetic
    TypeReference = 'TypeReference' as any,
    MethodSignature = 'MethodSignature' as any,
    FunctionType = 'FunctionType' as any,
    Class = 'Class' as any,
    MethodDeclaration = 'MethodDeclaration' as any,
    ConstructorDeclaration = 'ConstructorDeclaration' as any,
    GetAccessorDeclaration = 'GetAccessorDeclaration' as any,
    SetAccessorDeclaration = 'SetAccessorDeclaration' as any,
    EnumDeclaration = 'EnumDeclaration' as any,
    EnumMember = 'EnumMember' as any,
    TypeAlias = 'TypeAlias' as any,
    VariableDeclaration = 'VariableDeclaration' as any,
    StringLiteralType = 'StringLiteralType' as any,
    ConstructorType = 'ConstructorType' as any,
    ArrayType = 'ArrayType' as any,
    TupleType = 'TupleType' as any,
    ParenthesizedType = 'ParenthesizedType' as any,
    TypePredicate = 'TypePredicate' as any,
    FunctionDeclaration = 'FunctionDeclaration' as any,
}

export interface Item {
    id?: string;
    name?: string;
    comment?: string;
    itemType?: ItemType;
}
