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
import { TypeDoc, visitType } from './type';

import { CoreType, getCoreType, inspect } from './tools';

interface PropertyDoc extends DocItem {
    optional: boolean;
    type: TypeDoc;
}

interface InterfaceDoc extends DocItem {
    properties: PropertyDoc[];
}

export function visitInterfaceApparentProperty(symbol: Symbol, ctx: DocContext): PropertyDoc {
    let name = symbol.getName();
    let value = symbol.valueDeclaration as PropertyDeclaration;
    let optional = !!value.questionToken;
    let type = ctx.checker.getTypeAtLocation(value.type);
    let typeDoc = visitType(type, ctx);

    let propertyDoc = {
        itemType: DocItemType.Property,
        name,
        optional,
        type: typeDoc
    }

    return propertyDoc;
}

export function visitInterface(type: InterfaceType, ctx: DocContext): InterfaceDoc {
    let symbol = type.getSymbol();

    let name = symbol.name;
    let comment = symbol.getDocumentationComment();

    let properties = type.getApparentProperties().map((property) => {
        return visitInterfaceApparentProperty(property, ctx)
    });

    let DocItem: InterfaceDoc = {
        id: (type as any).id,
        itemType: DocItemType.Interface,
        name,
        comment: '',
        properties
    }

    inspect(DocItem);

    return DocItem;
}
