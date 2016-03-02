import { generateInline, expect, typeRef, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isIndexSignatureReflection
} from '../ast/type/signature';

describe('interface-index', () => {
    let module = generateInline(`
        interface Test {
            [ key: string ]: Test;
        }
    `);

    let iface = module.items[0];

    if (isInterfaceReflection(iface)) {
        let index = iface.indexSignatures[0];
        if (isIndexSignatureReflection(index)) {
            it ('reflection', () => {
                expect(index.parameters[0].name).equal('key');
                expect(coreType(index.parameters[0].type)).equal(CoreType.String);
                expect(typeRef(index.type)).equal(iface.id);
            });
        }
    } else {
        expect(false).to.true;
    }
});
