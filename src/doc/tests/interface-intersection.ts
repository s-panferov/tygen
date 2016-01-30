import { generateInline, expect } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,

} from '../ast/interface';

import {
    isIntersectionTypeReflection,
    isUnionTypeReflection
} from '../ast/type';

describe('interface-intersection', () => {
    let module = generateInline(`
        interface Test {
            p0: string & Test
            p1: string | Test
        }
    `);

    let iface = module.items[0];

    it('union type property', () => {
        if (isInterfaceReflection(iface)) {
            expect(iface.members).lengthOf(2);

            {
                let member = iface.members[0];
                let type = member.type;
                expect(isIntersectionTypeReflection(type)).to.true;

                if (isIntersectionTypeReflection(type)) {
                    expect(type.types).lengthOf(2);
                    expect(type.types[0].coreType).to.equal(CoreType.String);
                    expect(type.types[1].id).to.equal(iface.id);
                }

            }

            {
                let member = iface.members[1];
                let type = member.type;
                expect(isUnionTypeReflection(type)).to.true;

                if (isUnionTypeReflection(type)) {
                    expect(type.types).lengthOf(2);
                    expect(type.types[0].coreType).to.equal(CoreType.String);
                    expect(type.types[1].id).to.equal(iface.id);
                }
            }
        }
    });
});
