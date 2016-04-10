import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import {
    isVariableDeclarationReflection,
    VariableDeclarationType
} from '../ast/var';

describe('var:simple', () => {
    let module = generateInline(`
        const a = 'test';
    `);

    let variable = module.items[0];

    it('reflection', () => {
        expect(variable.name).equals('a');

        if (isVariableDeclarationReflection(variable)) {
            expect(variable.varType).equals(VariableDeclarationType.Const);
            expect(coreType(variable.type)).equals(CoreType.String);
            expect(variable.initializer).equals('\'test\'');
        } else {
           expect.fail();
        }
    });
});
