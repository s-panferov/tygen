import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isTypeAliasDeclarationReflection
} from '../ast/type-alias';

import {
    isStringLiteralTypeReflection
} from '../ast/type/string-literal';

describe('string-literal-type', () => {
    let module = generateInline(`
        type Test = 'string'
    `);

    let alias = module.items[0];

    it('reflection', () => {
        if (isTypeAliasDeclarationReflection(alias)) {
            let type = alias.type;
            if (isStringLiteralTypeReflection(type)) {
                expect(type.text).equal('string');
            } else {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});
