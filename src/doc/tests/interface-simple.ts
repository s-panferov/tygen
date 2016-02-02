import { generateInline, expect } from './utils';
import { CoreType } from '../tools';
import { isInterfaceReflection } from '../ast/interface';
import { isPropertySignatureReflection } from '../ast/type';

describe('interface:simple', () => {
    let module = generateInline(`
        interface Test {
            name: string
        }
    `);

    let iface = module.items[0];

    it('compiles', () => {
        expect(iface).to.ok;
    });

    it('interface', () => {
        expect(iface.id).to.ok;
        expect(iface.name).to.equal('Test');
        expect(isInterfaceReflection(iface)).to.true;
    });

    it('interface members', () => {
        if (isInterfaceReflection(iface)) {
            expect(iface.members).lengthOf(1);

            let first = iface.members[0];

            if (isPropertySignatureReflection(first)) {
                expect(first.name).to.equal('name');
                expect(first.optional).to.false;
                expect(first.type.coreType).to.equal(CoreType.String);
            } else {
                expect(false).to.true;
            }
        }
    });
});
