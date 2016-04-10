import { generateInline, expect } from './utils';
import {
    isInterfaceReflection,
} from '../ast/interface';

describe('interface-doc', () => {
    let module = generateInline(`
        /**
         * Doc comment example
         */
        interface Test<T> {

        }
    `);

    let iface = module.items[0];

    if (isInterfaceReflection(iface)) {
        it('doc comment', () => {
            expect(iface.comment).deep.equal({
                description: 'Doc comment example',
                tags: []
            });
        });
    } else {
        expect.fail();
    }
});
