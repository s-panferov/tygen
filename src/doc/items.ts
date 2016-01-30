export enum ItemType {
    Interface = 'Interface' as any,
    Property = 'Property' as any,
    UnionType = 'UnionType' as any,
    IntersectionType = 'IntersectionType' as any,
    Index = 'Index' as any,
    Type = 'Type' as any,
    AnonymousType = 'AnonymousType' as any,
    TypeLiteral = 'TypeLiteral' as any,
    TypeParameter = 'TypeParameter' as any,
    CallSignature = 'CallSignature' as any,
    TypeConstrint = 'TypeConstraint' as any,
    Parameter = 'Parameter' as any,
    Function = 'Function' as any,
}

export interface DocItem {
    id?: number;
    itemType: ItemType;
    name?: string;
    comment?: string;
}
