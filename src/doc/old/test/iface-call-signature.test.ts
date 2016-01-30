import { generateFile } from '../doc';
import * as path from 'path';
import { DocItemType } from '../items';
import { InterfaceDoc } from '../interface';
import { TypeLiteralDoc, AnonymousTypeDoc } from '../type';
import { expect } from 'chai';

let doc = generateFile(path.join(process.cwd(), 'src', 'doc', 'test', './iface-call-signature.ts'));

describe('iface-call-signature.ts', () => {
    let iface = doc.items[0] as InterfaceDoc;

    it('has interface', () => {
        expect(iface.itemType).equal(DocItemType.Interface);
        expect(iface.name).equal('CallSignatures');
        expect(iface.id).ok;
    });

    it('has call signatures', () => {
        expect(iface.callSignatures).lengthOf(1);
    })

    it('has construct signatures', () => {
        expect(iface.constructSignatures).lengthOf(1);
    })

    it('has function property', () => {
        expect(iface.properties).lengthOf(1);
        let prop = iface.properties[0];
        let type = prop.type as AnonymousTypeDoc;

        expect(prop.itemType).equal(DocItemType.Property);
        expect(prop.name).equal('doSmth');
        expect(type.itemType).equal(DocItemType.AnonymousType);
        expect(type.constructSignatures).lengthOf(0);
        expect(type.callSignatures).lengthOf(2);
    })
});
