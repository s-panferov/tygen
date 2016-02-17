import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isTypeAliasDeclarationReflection
} from '../ast/type-alias';

import {
    isConstructorTypeReflection,
} from '../ast/type';

describe('constructor-type', () => {
    let module = generateInline(`
        type Test = new <T>(name: T) => Promise<any>;
    `);

    let alias = module.items[0];

    it('reflection', () => {
        if (isTypeAliasDeclarationReflection(alias)) {
            let type = alias.type;
            if (isConstructorTypeReflection(type)) {
                expect(type.signature.typeParameters).lengthOf(1);
                expect(type.signature.parameters).lengthOf(1);
                expect(type.signature.type).ok;
            } else {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});
