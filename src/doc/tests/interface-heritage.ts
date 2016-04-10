import { generateInline, expect, coreType, typeRef } from './utils';
import { CoreType } from '../tools';
import { ItemType } from '../items';
import {
    isInterfaceReflection,
    HeritageClauseType
} from '../ast/interface';

describe('interface-heritage', () => {
    let module = generateInline(`
        interface Test extends Base<string> {

        }

        interface Base<T> { }
    `);

    let iface = module.items[0];
    let base = module.items[1];

    it('reflection', () => {
        if (isInterfaceReflection(iface)) {
            if (isInterfaceReflection(base)) {
                let hc = iface.heritageClauses[0];
                expect(hc.itemType).equal(ItemType.HeritageClause);
                expect(hc.clause).equal(HeritageClauseType.Extends);
                expect(typeRef(hc.types[0].expression.type)).equal(base.selfRef.id);
                expect(coreType(hc.types[0].typeArguments[0])).equal(CoreType.String);
            } else {
                expect.fail();
            }
        } else {
            expect.fail();
        }
    });
});
