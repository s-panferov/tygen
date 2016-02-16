import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isVariableDeclarationReflection,
    VariableDeclarationType
} from '../ast/var';
import {
    isTypeLiteralReflection,
    isTypeReferenceReflection
} from '../ast/type';

describe('var:simple', () => {
    let module = generateInline(`
        const a = foo();
        const b = bar();

        type Foo = {
            a: string;
            b: number;
        }

        interface Bar {
            a: string;
            b: number;
        }

        function foo(): Foo {
            return null;
        }

        function bar(): Bar {
            return null;
        }
    `);

    it('first var reflection', () => {
        let variable = module.items[0];
        expect(variable.name).equals('a');

        if (isVariableDeclarationReflection(variable)) {
            expect(variable.varType).equals(VariableDeclarationType.Const);
            expect(variable.initializer).equals('foo()');
            let type = variable.type;

            if (isTypeLiteralReflection(type)) {
                expect(type.members).lengthOf(2);
                expect(type.members[0].name).equals('a');
                expect(type.members[1].name).equals('b');
            } else {
                expect(false).to.true;
            }
        } else {
           expect(false).to.true;
        }
    });

    it('second var reflection', () => {
        let variable = module.items[1];
        expect(variable.name).equals('b');

        if (isVariableDeclarationReflection(variable)) {
            expect(variable.varType).equals(VariableDeclarationType.Const);
            expect(variable.initializer).equals('bar()');
            let type = variable.type;

            if (isTypeReferenceReflection(type)) {
                expect(type.typeName).equals('Bar');
                expect(type.ref).equals(module.items[3].id);
            } else {
                expect(false).to.true;
            }
        } else {
           expect(false).to.true;
        }
    });
});
