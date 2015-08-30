import { generateFile } from '../doc';
import * as path from 'path';
import { DocItemType } from '../items';
import { InterfaceDoc } from '../interface';
import { TypeLiteralDoc } from '../type';
import { expect } from 'chai';

let doc = generateFile(path.join(process.cwd(), 'src', 'doc', 'test', './iface-property-func.ts'));

describe('iface-property-func.ts', () => {
    describe('interface Test', () => {
        let iface = doc.items[0] as InterfaceDoc;

        it('has interface', () => {
            expect(iface.itemType).equal(DocItemType.Interface);
            expect(iface.name).equal('Test');
            expect(iface.id).ok;
        });

        describe('.call property', () => {
            let prop = iface.properties[0];

            it('meta', () => {
                expect(prop.itemType).equal(DocItemType.Property);
                expect(prop.name).equal('call');
                expect(prop.optional).not.true;
            });

            it('type meta', () => {
                let type = prop.type as TypeLiteralDoc;
                expect(type.itemType).equal(DocItemType.TypeLiteral);
            });

            it('call signature type parameter', () => {
                let type = prop.type as TypeLiteralDoc;
                let signature = type.callSignatures[0];

                expect(signature.typeParameters).lengthOf(1);

                let typeParameter = signature.typeParameters[0];

                expect(typeParameter.itemType).equal(DocItemType.TypeParameter);
                expect(typeParameter.name).equal('T');
                expect(typeParameter.id).ok
            });

            it('call signature parameters', () => {
                let type = prop.type as TypeLiteralDoc;
                let signature = type.callSignatures[0];

                expect(signature.parameters).lengthOf(1);

                let parameter = signature.parameters[0];

                expect(parameter.itemType).equal(DocItemType.Parameter);
                expect(parameter.name).equal('value');
                expect(parameter.rest).false
                expect(parameter.optional).false
                expect(parameter.type.id).equal(signature.typeParameters[0].id);
            });

            it('call signature return type', () => {
                let type = prop.type as TypeLiteralDoc;
                let signature = type.callSignatures[0];

                expect(signature.returnType.itemType).equal(DocItemType.Type);
                expect(signature.returnType.id).equal(signature.typeParameters[0].id);
            });
        });
    });
});
