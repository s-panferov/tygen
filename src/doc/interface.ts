import {
    InterfaceDeclaration,
    InterfaceType,
    InterfaceTypeWithDeclaredMembers,
    PropertyDeclaration,
    SymbolFlags,
    TypeFlags,
    Type,
    Symbol
} from 'typescript';

import { DocContext } from './doc';
import { DocItem, DocItemType } from './items';
import { visitSymbol } from './gen';
import {
    TypeDoc, visitType, CallSignatureDoc,
    visitCallSignature, getCallSignatures,
    Index, IndexDoc, visitIndexType, Signatures
} from './type';

import { CoreType, getCoreType, inspect } from './tools';

export interface InterfacePropertyDoc extends DocItem {
    optional: boolean;
    method: boolean;
    type: TypeDoc;
}

export interface InterfaceDoc extends DocItem, Signatures, Index {
    properties: InterfacePropertyDoc[];
    apparentProperties: InterfacePropertyDoc[];
}

export function visitInterfaceProperty(symbol: Symbol, ctx: DocContext): InterfacePropertyDoc {
    let name = symbol.getName();
    let value = symbol.valueDeclaration as PropertyDeclaration;
    let optional = !!value.questionToken;
    let method = !!(symbol.flags & SymbolFlags.Method);

    let type = ctx.checker.getTypeAtLocation(value);
    let typeDoc = visitType(type, ctx);

    let propertyDoc = {
        itemType: DocItemType.Property,
        name,
        optional,
        method,
        type: typeDoc,
    }

    return propertyDoc;
}

export function visitInterface(type: InterfaceType, ctx: DocContext): InterfaceDoc {
    let symbol = type.getSymbol();

    let name = symbol.name;
    let comment = symbol.getDocumentationComment();

    // FIXME too dirty in debug output
    // let apparentProperties = (type.getApparentProperties() || []).map((property) => {
    //     return visitInterfaceProperty(property, ctx)
    // });

    let apparentProperties = [];

    let properties = (type.getProperties() || []).map((property) => {
        return visitInterfaceProperty(property, ctx)
    });

    let callSignatures = (type.getCallSignatures() || []).map((signature) => {
        return visitCallSignature(signature, ctx);
    });

    let constructSignatures = (type.getConstructSignatures() || []).map((signature) => {
        return visitCallSignature(signature, ctx);
    });

    let DocItem: InterfaceDoc = {
        id: (type as any).id,
        itemType: DocItemType.Interface,
        name,
        comment: '',
        apparentProperties,
        properties,
        callSignatures,
        constructSignatures,
        stringIndex: visitIndexType(type, type.getStringIndexType(), ctx),
        numberIndex: visitIndexType(type, type.getNumberIndexType(), ctx)
    }

    return DocItem;
}
