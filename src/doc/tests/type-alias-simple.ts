import { generateInline, expect, typeRef } from './utils';
import {
    isTypeAliasDeclarationReflection
} from '../ast/type-alias';

import {
    isUnionTypeReflection,
} from '../ast/type/intersection-union';

import {
    isTypeReferenceReflection
} from '../ast/type/type-reference';

describe('type-alias:simple', () => {
    let module = generateInline(`
        type Alias<T> = T | Promise<T>
        type Alias2<T> = T | Promise<T>

        let a: Alias2<string> = 'any';
    `);

    let alias = module.items[0];

    it('reflection', () => {
        expect(alias.selfRef.id).to.ok;
        expect(alias.selfRef.semanticId).eq('Alias');
        expect(alias.name).to.equal('Alias');
    });

    it('types', () => {
        if (isTypeAliasDeclarationReflection(alias)) {
            expect(alias.typeParameters).lengthOf(1);

            const tp = alias.typeParameters[0];
            const type = alias.type;

            if (isUnionTypeReflection(type)) {
                expect(type.types).lengthOf(2);
                const first = type.types[0];
                if (isTypeReferenceReflection(first)) {
                    expect(first.typeName).equals('T');
                    expect(first.ref.id).equals(tp.selfRef.id);
                } else {
                    expect.fail();
                }

                const second = type.types[1];
                if (isTypeReferenceReflection(second)) {
                    expect(second.typeName).equals('Promise');
                    expect(second.typeArguments).lengthOf(1);

                    let ta = second.typeArguments[0];

                    if (isTypeReferenceReflection(ta)) {
                        expect(ta.typeName).equals('T');
                        expect(typeRef(ta)).equals(tp.selfRef.id);
                    } else {
                        expect.fail();
                    }
                } else {
                    expect.fail();
                }
            } else {
                expect.fail();
            }
        } else {
            expect.fail();
        }
    });
});
