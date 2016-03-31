import { generateInline, expect, typeRef } from './utils';
import { CoreType } from '../tools';
import {
    isInterfaceReflection,
    InterfaceReflection,
} from '../ast/interface';

import {
    isCallSignatureReflection,
    isFunctionTypeReflection,
    SignatureReflection
} from '../ast/type/signature';

import {
    isPropertySignatureReflection,
} from '../ast/type/property';

import {
    isTypeReferenceReflection,
} from '../ast/type/type-reference';

import {
    isMethodReflection,
} from '../ast/function';

describe('interface-call', () => {
    let module = generateInline(`
        interface Test<T> {
            <I>(a: I): Test<I>
            method<I>(a: I): Test<I>
            property?: <I>(a: I) => Test<I>
        }
    `);

    let iface = module.items[0];

    it ('call signature reflection', () => {
        if (isInterfaceReflection(iface)) {
            let callSig = iface.callSignatures[0];
            if (isCallSignatureReflection(callSig)) {
                testSignature(iface, callSig);
            } else {
                expect(false).to.true;
            }

            let methodSig = iface.properties[0];
            if (isMethodReflection(methodSig)) {
                expect(methodSig.name).equal('method');
                testSignature(iface, methodSig.callSignatures[0]);
            } else {
                expect(false).to.true;
            }

            let propertySig = iface.properties[1];
            if (isPropertySignatureReflection(propertySig)) {
                expect(propertySig.name).equal('property');
                expect(propertySig.optional).true;
                let type = propertySig.type;
                if (isFunctionTypeReflection(type)) {
                    testSignature(iface, type.signature);
                } else {
                    expect(false).to.true;
                }
            } else {
                expect(false).to.true;
            }
        } else {
            expect(false).to.true;
        }
    });
});

function testSignature(iface: InterfaceReflection, callSig: SignatureReflection) {
    expect(callSig.typeParameters[0].name).equal('I');
    expect(callSig.typeParameters[0].selfRef.id).to.ok;
    expect(callSig.parameters[0].name).equal('a');
    expect(typeRef(callSig.parameters[0].type)).equal(callSig.typeParameters[0].selfRef.id);
    let type = callSig.type;
    if (isTypeReferenceReflection(type)) {
        expect(type.typeName).equal('Test');
        expect(type.ref.id).equal(iface.selfRef.id);
        expect(typeRef(type.typeArguments[0])).equal(callSig.typeParameters[0].selfRef.id);
    } else {
        expect(false).to.true;
    }
}
