import { generateFile } from '../doc';
import * as path from 'path';
import { DocItemType } from '../items';
import { FunctionDoc } from '../function';
import { expect } from 'chai';
import { CoreType } from '../tools';

let doc = generateFile(path.join(process.cwd(), 'src', 'doc', 'test', './func.ts'));
let item = doc.items[0] as FunctionDoc;

describe('func.ts', () => {
    describe('func', () => {
        it('meta', () => {
            expect(item.itemType).equal(DocItemType.Function);
            expect(item.name).equal('func');
            expect(item.id).ok;
        });

        it('call signature parameters', () => {
            let signature = item.callSignatures[0];

            expect(signature.parameters).lengthOf(1);

            let parameter = signature.parameters[0];

            expect(parameter.itemType).equal(DocItemType.Parameter);
            expect(parameter.name).equal('name');
            expect(parameter.rest).false
            expect(parameter.optional).false
        })

        it('call signature return type', () => {
            let signature = item.callSignatures[0];

            let type = signature.returnType;
            expect(type.coreType).equal(CoreType.String);
        })
    })
});
