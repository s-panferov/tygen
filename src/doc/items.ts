export enum DocItemType {
    Interface = 'Interface' as any,
    Property = 'Property' as any,
    UnionType = 'UnionType' as any,
    IntersectionType = 'IntersectionType' as any,
    Type = 'Type' as any,
    TypeLiteral = 'TypeLiteral' as any,
    TypeParameter = 'TypeParameter' as any,
    CallSignature = 'CallSignature' as any,
    TypeConstrint = 'TypeConstraint' as any,
    Parameter = 'Parameter' as any
}

export interface DocItem {
    id?: number;
    itemType: DocItemType;
    name?: string;
    comment?: string;
}
