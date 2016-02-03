import { generateInline, expect } from './utils';
import {
    isClassReflection
} from '../ast/class';
import {
    isConstructorDeclarationReflection,
} from '../ast/type';

describe('class:constructor', () => {
    let module = generateInline(`
        class Test {
            constructor() { }
            constructor(a: Test) { }
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

            let first = cls.members[0];
            let second = cls.members[1];

            if (!isConstructorDeclarationReflection(first)) {
                expect(false).to.true;
            }

            if (!isConstructorDeclarationReflection(second)) {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});
