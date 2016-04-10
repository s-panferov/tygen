import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isTypeAliasDeclarationReflection
} from '../ast/type-alias';

import {
    isArrayTypeReflection
} from '../ast/type/array';

describe('array-type', () => {
    let module = generateInline(`
        type Test = string[]
    `);

    let alias = module.items[0];

    it('reflection', () => {
        if (isTypeAliasDeclarationReflection(alias)) {
            let type = alias.type;
            if (isArrayTypeReflection(type)) {
                expect(coreType(type.elementType)).equal('string');
            } else {
                expect.fail();
            }
        } else {
            expect.fail();
        }
    });
});
