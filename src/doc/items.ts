export enum RefType {
    Interface = 'Interface' as any,
    UnionType = 'UnionType' as any,
    IntersectionType = 'IntersectionType' as any,
    TypeLiteral = 'TypeLiteral' as any,
}

export interface Item {
    id?: string;
    name?: string;
    comment?: string;
    refType?: RefType;
}
