import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isFunctionReflection
} from '../ast/function';

import {
    isTypePredicateReflection
} from '../ast/type/type-predicate';

describe('type-predicate', () => {
    let module = generateInline(`
        function test(name: any): name is string {
            return true;
        }
    `);

    let func = module.items[0];

    it('reflection', () => {
        if (isFunctionReflection(func)) {
            let signature = func.callSignatures[0];
            let type = signature.type;
            if (isTypePredicateReflection(type)) {
                expect(coreType(type.type)).equal(CoreType.String);
                expect(type.parameterName).equal('name');
            } else {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});
