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
    `);

    let alias = module.items[0];

    it('reflection', () => {
        expect(alias.id).to.ok;
        expect(alias.name).to.equal('Alias');
    });

    it('types', () => {
        if (isTypeAliasDeclarationReflection(alias)) {
            expect(alias.typeParameters).lengthOf(1);

            const tp = alias.typeParameters[0];
            expect(tp.name).equals('T');

            const type = alias.type;
            if (isUnionTypeReflection(type)) {
                expect(type.types).lengthOf(2);
                const first = type.types[0];
                if (isTypeReferenceReflection(first)) {
                    expect(first.typeName).equals('T');
                    expect(first.ref).equals(tp.id);
                } else {
                    expect(false).to.true;
                }

                const second = type.types[1];
                if (isTypeReferenceReflection(second)) {
                    expect(second.typeName).equals('Promise');
                    expect(second.typeArguments).lengthOf(1);
                    expect(second.targetType).to.ok;

                    let ta = second.typeArguments[0];

                    if (isTypeReferenceReflection(ta)) {
                        expect(ta.typeName).equals('T');
                        expect(typeRef(ta)).equals(tp.id);
                    } else {
                        expect(false).to.true;
                    }
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
