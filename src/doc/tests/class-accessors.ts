import { generateInline, expect } from './utils';
import {
    isClassReflection
} from '../ast/class';
import {
    isGetAccessorDeclarationReflection,
    isSetAccessorDeclarationReflection,
} from '../ast/type';

describe('class:accessors', () => {
    let module = generateInline(`
        class Test {
            get name(): Test {
                return null;
            }

            set name(a: Test) {
                return null;
            }
        }
    `);

    let cls = module.items[0];

    it('compiles', () => {
        expect(cls).to.ok;
    });

    it('class', () => {
        expect(cls.id).to.ok;
        expect(cls.name).to.equal('Test');
    });

    it('members', () => {
        if (isClassReflection(cls)) {
            expect(cls.members).lengthOf(2);

            let getter = cls.members[0];

            if (isGetAccessorDeclarationReflection(getter)) {
                expect(getter.name).to.equal('name');
                expect(getter.type.id).to.equal(cls.id);
            } else {
                expect(false).to.true;
            }

            let setter = cls.members[1];

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
