import { generateInline, expect, typeRef } from './utils';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isPropertySignatureReflection,
} from '../ast/type/property';
import {
    isTypeLiteralReflection,
} from '../ast/type/type-literal';

describe('interface-literal', () => {
    let module = generateInline(`
        interface Test {
            p0?: {
                p0: Test
            }
        }
    `);

    let iface = module.items[0];

    it('literal type property', () => {
        if (isInterfaceReflection(iface)) {
            expect(iface.properties).lengthOf(1);

            let first = iface.properties[0];

            if (isPropertySignatureReflection(first)) {
                expect(first.name).to.equal('p0');
                expect(first.optional).to.true;

                let type = first.type;
                expect(isTypeLiteralReflection(type)).to.true;

                if (isTypeLiteralReflection(type)) {
                    expect(type.members).lengthOf(1);
                    let member = type.members[0];

                    if (isPropertySignatureReflection(member)) {
                        expect(member.name).to.equal('p0');
                        expect(typeRef(member.type)).equal(iface.id);
                    } else {
                        expect(false).to.true;
                    }
                } else {
                    expect(false).to.true;
                }
            } else {
                expect(false).to.true;
            }
        }
    });
});
