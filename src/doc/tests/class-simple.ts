import { generateInline, expect } from './utils';
import {
    isClassReflection
} from '../ast/class';
import {
    isPropertyDeclarationReflection
} from '../ast/type';

describe('class:simple', () => {
    let module = generateInline(`
        class Test {
            prop: Test;
            // get name() {
            //     return null;
            // }

            // set name(a: string) {
            //     return null;
            // }

            // name: string
            // method(a: string = 1) {
            //
            // }
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
            expect(cls.members).lengthOf(1);

            let first = cls.members[0];

            if (isPropertyDeclarationReflection(first)) {
                expect(first.name).to.equal('prop');
                expect(first.optional).to.false;
                expect(first.type.id).to.equal(cls.id);
            } else {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});
