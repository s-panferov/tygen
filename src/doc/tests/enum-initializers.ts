import { generateInline, expect } from './utils';
import {
    isEnumDeclarationReflection
} from '../ast/enum';

describe('enum:initializer', () => {
    let module = generateInline(`
        enum Test {
            A = 1,
            B = 'string' as any,
            C = (() => void) as any
        }
    `);

    let en = module.items[0];

    it('reflection', () => {
        expect(en.id).to.ok;
        expect(en.name).to.equal('Test');
    });

    it('members', () => {
        if (isEnumDeclarationReflection(en)) {
            expect(en.members).lengthOf(3);

            expect(en.members[0].initializer).to.equal('1');
            expect(en.members[1].initializer).to.equal('\'string\' as any');
            expect(en.members[2].initializer).to.equal('(() => void) as any');
        } else {
            expect(false).to.true;
        }
    });
});
