export enum RefType {
    Interface = 'Interface' as any,
    UnionType = 'UnionType' as any,
    IntersectionType = 'IntersectionType' as any,
    TypeLiteral = 'TypeLiteral' as any,
    PropertySignature = 'PropertySignature' as any,
    TypeParameter = 'TypeParameter' as any,
    HeritageClause = 'HeritageClause' as any,
    ExpressionWithTypeArguments = 'ExpressionWithTypeArguments' as any,
    LeftHandSideExpression = 'LeftHandSideExpression' as any,
    IndexSignature = 'IndexSignature' as any,
    Parameter = 'Parameter' as any,
    CallSignature = 'CallSignature' as any,
    Signature = 'Signature' as any,
    TypeReference = 'TypeReference' as any,
    MethodSignature = 'MethodSignature' as any,
}

export interface Item {
    id?: string;
    name?: string;
    comment?: string;
    refType?: RefType;
}
