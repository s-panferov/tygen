import { generateInline, expect } from './utils';
import {
    isInterfaceReflection,
} from '../ast/interface';

describe('interface-call', () => {
    let module = generateInline(`
        /**
         * Doc comment example
         * @example
         */
        interface Test<T> {

        }
    `);

    let iface = module.items[0];

    if (isInterfaceReflection(iface)) {
        it('doc comment', () => {
            expect(iface.comment).equal('Doc comment example\n@example');
        });
    } else {
        expect(false).to.true;
    }
});
