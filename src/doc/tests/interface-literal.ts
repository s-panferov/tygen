import { generateInline, expect } from './utils';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isTypeLiteralReflection,
    isPropertySignatureReflection
} from '../ast/type';

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
            expect(iface.members).lengthOf(1);

            let first = iface.members[0];

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
                        expect(member.type.id).to.equal(iface.id);
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
