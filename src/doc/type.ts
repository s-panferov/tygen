import { CoreType, getCoreType, inspect } from './tools';
import { DocItem, DocItemType } from './items';
import {
    Type,
    TypeFlags,
    UnionOrIntersectionType,
    ObjectType
} from 'typescript';

import { DocContext } from './doc';

export interface TypeDoc extends DocItem {
    coreType?: CoreType;
}

export interface UnionOrIntersectionTypeDoc extends DocItem {
    types: TypeDoc[];
}

export function visitType(type: Type, ctx: DocContext): TypeDoc {
    if (type.flags & TypeFlags.UnionOrIntersection) {
        return visitUnionOrIntersectionType(type as UnionOrIntersectionType, ctx);
    }

    console.log(type)
    console.log(type.getCallSignatures())

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
