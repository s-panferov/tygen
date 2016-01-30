import { generateFile } from '../doc';
import * as path from 'path';
import { DocItemType } from '../items';
import { InterfaceDoc } from '../interface';
import { TypeLiteralDoc, AnonymousTypeDoc } from '../type';
import { expect } from 'chai';

let doc = generateFile(path.join(process.cwd(), 'src', 'doc', 'test', './iface-index.ts'));

describe('iface-index.ts', () => {
    let iface = doc.items[0] as InterfaceDoc;

    it('has interface', () => {
        expect(iface.itemType).equal(DocItemType.Interface);
        expect(iface.name).equal('Index');
        expect(iface.id).ok;
    });

    it('has indexer signatures', () => {
        expect(iface.stringIndex.type.id).equal(iface.id);
        expect(iface.numberIndex.type.id).equal(iface.id);
    })
});
