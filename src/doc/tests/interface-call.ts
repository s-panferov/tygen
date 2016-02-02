import { generateInline, expect } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,
} from '../ast/interface';

import {
    isCallSignatureReflection,
    isTypeReferenceReflection
} from '../ast/type';

describe('interface-call', () => {
    let module = generateInline(`
        interface Test<T> {
            <I>(a: I): Test<I>
        }
    `);

    let iface = module.items[0];

    if (isInterfaceReflection(iface)) {
        let callSig = iface.members[0];
        if (isCallSignatureReflection(callSig)) {
            it ('reflection', () => {
                expect(callSig.typeParameters[0].name).equal('I');
                expect(callSig.typeParameters[0].id).to.ok;
                expect(callSig.parameters[0].name).equal('a');
                expect(callSig.parameters[0].type.id).equal(callSig.typeParameters[0].id);
                let type = callSig.type;
                if (isTypeReferenceReflection(type)) {
                    expect(type.typeName).equal('Test');
                    expect(type.targetType.id).equal(iface.id);
                    expect(type.typeArguments[0].id).equal(callSig.typeParameters[0].id);
                } else {
                    expect(false).to.true;
                }
            });
        } else {
            expect(false).to.true;
        }
    } else {
        expect(false).to.true;
    }
});
