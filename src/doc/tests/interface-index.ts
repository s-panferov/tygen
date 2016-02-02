import { generateInline, expect } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isIndexSignatureReflection
} from '../ast/type';

describe('interface-index', () => {
    let module = generateInline(`
        interface Test {
            [ key: string ]: Test;
        }
    `);

    let iface = module.items[0];

    if (isInterfaceReflection(iface)) {
        let index = iface.members[0];
        if (isIndexSignatureReflection(index)) {
            it ('reflection', () => {
                expect(index.parameters[0].name).equal('key');
                expect(index.parameters[0].type.coreType).equal(CoreType.String);
                expect(index.type.id).equal(iface.id);
            });
        }
    } else {
        expect(false).to.true;
    }
});
