import { generateInline, expect } from './utils';
import { RefType } from '../items';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isPropertySignatureReflection,
} from '../ast/type';

describe('interface-generic', () => {
    let module = generateInline(`
        interface Test<T, A extends T> {
            p0: T
            p1: A
        }
    `);

    let iface = module.items[0];

    if (isInterfaceReflection(iface)) {
        it('members', () => {
            expect(iface.members).lengthOf(2);
        });

        it('type parameters', () => {
            expect(iface.typeParameters).lengthOf(2);
        });

        it('first type parameter', () => {
            let tp = iface.typeParameters[0];

            expect(tp.name).equal('T');
            expect(tp.refType).equal(RefType.TypeParameter);

            let member = iface.members[0];
            if (isPropertySignatureReflection(member)) {
                expect(member.type.id).equal(tp.id);
            }
        });

        it('second type parameter', () => {
            let tp = iface.typeParameters[1];

            expect(tp.name).equal('A');
            expect(tp.refType).equal(RefType.TypeParameter);

            let member = iface.members[1];
            if (isPropertySignatureReflection(member)) {
                expect(member.type.id).equal(tp.id);
            }
            expect(tp.constraint.id).equal(iface.typeParameters[0].id);
        });
    } else {
        expect(false).to.true;
    }
});
