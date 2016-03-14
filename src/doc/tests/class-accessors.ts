import { generateInline, expect, typeRef } from './utils';
import {
    isClassReflection
} from '../ast/class';
import {
    isGetAccessorDeclarationReflection,
    isSetAccessorDeclarationReflection,
} from '../ast/type/signature';

describe('class:accessors', () => {
    let module = generateInline(`
        class Test {
            get name(): Test {
                return null;
            }
            set name(a: Test) {

            }
        }
    `);

    let cls = module.items[0];

    it('compiles', () => {
        expect(cls).to.ok;
    });

    it('class', () => {
        expect(cls.selfRef.id).to.ok;
        expect(cls.name).to.equal('Test');
    });

    it('members', () => {
        if (isClassReflection(cls)) {
            expect(cls.properties).lengthOf(2);

            let getter = cls.properties[0];

            if (isGetAccessorDeclarationReflection(getter)) {
                expect(getter.name).to.equal('name');
                expect(typeRef(getter.type)).to.equal(cls.selfRef.id);
            } else {
                expect(false).to.true;
            }

            let setter = cls.properties[1];

            if (isSetAccessorDeclarationReflection(setter)) {
                expect(setter.name).to.equal('name');
            } else {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});
