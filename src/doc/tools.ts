import { Type, TypeFlags } from 'typescript';
import { inspect as nodeInspect } from 'util';

export enum CoreType {
    Any = 'any' as any,
    String = 'string' as any,
    Number = 'number' as any,
    Boolean = 'boolean' as any,
    Void = 'void' as any,
    Symbol = 'symbol' as any,
    Null = 'null' as any,
    Undefined = 'undefined' as any,
    This = 'this' as any,
}

export function getCoreType(type: Type): CoreType {
    if (type.flags & TypeFlags.String) {
        return CoreType.String;
    } else if (type.flags & TypeFlags.Number) {
        return CoreType.Number;
    } else if (type.flags & TypeFlags.Any) {
        return CoreType.Any;
    } else if (type.flags & TypeFlags.Boolean) {
        return CoreType.Boolean;
    } else if (type.flags & TypeFlags.Void) {
        return CoreType.Void;
    } else if (type.flags & TypeFlags.ESSymbol) {
        return CoreType.Symbol;
    }
}

export function inspect(obj: any) {
    console.log(nodeInspect(obj, { depth:null }));
}
