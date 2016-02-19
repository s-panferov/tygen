import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import { isFunctionDeclarationReflection } from '../ast/function';

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

        if (isFunctionDeclarationReflection(func)) {
            expect(coreType(func.parameters[0].type)).equals(CoreType.String);
            expect(coreType(func.parameters[1].type)).equals(CoreType.Number);
            expect(coreType(func.type)).equals(CoreType.String);
        } else {
            expect(false).to.true;
        }
    });
});
