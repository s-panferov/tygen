import { generateInline, expect } from './utils';
import { Item } from '../items';
import { isInterfaceReflection } from '../ast/interface';
import { isPropertySignatureReflection } from '../ast/type/property';

function isInherited(item: Item): boolean {
    if (isPropertySignatureReflection(item)) {
        return item.inherited;
    } else {
        throw new Error(`Not a property`);
    }
}

describe('interface:properties', () => {
    let module = generateInline(`
        interface Test<T> extends Array<T> {
            ownProperty: string
        }
    `);

    let iface = module.items[0];

    it('interface properties', () => {
        if (isInterfaceReflection(iface)) {
            expect(iface.properties).not.lengthOf(1);
            let first = iface.properties.find(prop => prop.name == 'ownProperty');
            let other = iface.properties.filter(prop => isPropertySignatureReflection(prop) && prop.name !== 'ownProperty');
            expect(isInherited(first)).is.false;
            other.forEach(item => {
                expect(isInherited(item)).is.true;
            });
        } else {
            expect.fail();
        }
    });
});
