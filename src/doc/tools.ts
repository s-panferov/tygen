import { Type, TypeFlags } from 'typescript';
import { inspect as nodeInspect } from 'util';

export enum CoreType {
    Any = 'any' as any,
    String = 'string' as any,
    Number = 'number' as any,
}

export function getCoreType(type: Type): CoreType {
    if (type.flags & TypeFlags.String) {
        return CoreType.String;
    } else if (type.flags & TypeFlags.Number) {
        return CoreType.Number;
    } else if (type.flags & TypeFlags.Any) {
        return CoreType.Any;
    }
}

export function inspect(obj: any) {
    console.log(nodeInspect(obj, { depth:null }));
}
