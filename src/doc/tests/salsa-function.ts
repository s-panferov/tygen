import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import { isFunctionReflection } from '../ast/function';

describe('salsa:simple', () => {
    let module = generateInline(`
        /**
         * @param {string} a
         * @param {number} b
         * @returns {string}
         */
        function foo(a, b) {
          return a + b;
        }
    `, '.js');

    let func = module.items[0];

    it('compiles', () => {
        expect(func).to.ok;
        expect(func.name).equal('foo');

        if (isFunctionReflection(func)) {
            let signature = func.callSignatures[0];
            expect(coreType(signature.parameters[0].type)).equals(CoreType.String);
            expect(coreType(signature.parameters[1].type)).equals(CoreType.Number);
            expect(coreType(signature.type)).equals(CoreType.String);
        } else {
            expect(false).to.true;
        }
    });
});
