import { generateInline, expect } from './utils';
import {
    isInterfaceReflection,
    isTypeLiteralReflection
} from '../ast/interface';

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
            expect(first.name).to.equal('p0');
            expect(first.optional).to.true;

            let type = first.type;
            expect(isTypeLiteralReflection(type)).to.true;

            if (isTypeLiteralReflection(type)) {
                expect(type.members).lengthOf(1);
                expect(type.members[0].name).to.equal('p0');
                expect(type.members[0].type.id).to.equal(iface.id);
            }
        }
    });
});
