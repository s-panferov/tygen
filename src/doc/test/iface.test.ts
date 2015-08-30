import { generateFile } from '../doc';
import * as path from 'path';
import { DocItemType } from '../items';
import { expect } from 'chai';

let doc = generateFile(path.join(process.cwd(), 'src', 'doc', 'test', './iface.ts'));

describe('iface.ts', () => {
    it('has interface', () => {
        let item = doc.items[0];
        expect(item.itemType).to.equal(DocItemType.Interface);
        expect(item.name).to.equal('Test');
        expect(item.id).to.ok;
    });
});
