import { generateFile } from '../doc';
import * as path from 'path';
import { DocItemType } from '../items';
import { InterfaceDoc } from '../interface';
import { expect } from 'chai';
import { CoreType } from '../tools';

let doc = generateFile(path.join(process.cwd(), 'src', 'doc', 'test', './iface.ts'));
let item = doc.items[0] as InterfaceDoc;

describe('iface.ts', () => {
    it('meta', () => {
        expect(item.itemType).equal(DocItemType.Interface);
        expect(item.name).equal('Test');
        expect(item.id).ok;
    });

    it('property', () => {
        let property = item.properties[0];
        expect(property.itemType).equal(DocItemType.Property);
        expect(property.name).equal('name');
        expect(property.optional).true;
        expect(property.type.coreType).equal(CoreType.String);
    })
});
