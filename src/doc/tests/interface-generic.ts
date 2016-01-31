import { generateInline, expect } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,

} from '../ast/interface';

import {
    isIntersectionTypeReflection,
    isUnionTypeReflection
} from '../ast/type';

describe('interface-generic', () => {
    let module = generateInline(`
        interface Test<T, A extends T> {
            p0: T
            p1: A
        }
    `);

    let iface = module.items[0];

    it('generic types in interface', () => {
        if (isInterfaceReflection(iface)) {
            expect(iface.members).lengthOf(2);
        }
    });
});
