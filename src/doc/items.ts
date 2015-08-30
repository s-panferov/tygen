export enum DocItemType {
    Interface = 'Interface' as any,
    Property = 'Property' as any,
    UnionType = 'UnionType' as any,
    IntersectionType = 'IntersectionType' as any,
    Type = 'Type' as any
}

export interface DocItem {
    id?: number;
    itemType: DocItemType;
    name?: string;
    comment?: string;
}
