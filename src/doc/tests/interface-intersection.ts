import { generateInline, expect, typeRef, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isIntersectionTypeReflection,
    isUnionTypeReflection,
    isPropertySignatureReflection
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

                if (isPropertySignatureReflection(member)) {
                    let type = member.type;
                    expect(isIntersectionTypeReflection(type)).to.true;

                    if (isIntersectionTypeReflection(type)) {
                        expect(type.types).lengthOf(2);
                        expect(coreType(type.types[0])).to.equal(CoreType.String);
                        expect(typeRef(type.types[1])).to.equal(iface.id);
                    } else {
                        expect(false).to.true;
                    }
                } else {
                    expect(false).to.true;
                }
            }

            {
                let member = iface.members[1];

                if (isPropertySignatureReflection(member)) {
                    let type = member.type;
                    expect(isUnionTypeReflection(type)).to.true;

                    if (isUnionTypeReflection(type)) {
                        expect(type.types).lengthOf(2);
                        expect(coreType(type.types[0])).to.equal(CoreType.String);
                        expect(typeRef(type.types[1])).to.equal(iface.id);
                    } else {
                        expect(false).to.true;
                    }
                } else {
                    expect(false).to.true;
                }
            }
        }
    });
});
