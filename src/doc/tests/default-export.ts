import { generateInline, expect, coreType } from './utils';
import { CoreType } from '../tools';
import { isFunctionReflection } from '../ast/function';
import { isClassReflection } from '../ast/class';

describe('default export', () => {
    let module = generateInline(`
        export default function test() { }
        export default class Test {}
    `);

    let func = module.items[0];
    let cls = module.items[1];

    it('reflect function semanticId and name', () => {
        if (isFunctionReflection(func)) {
            expect(func.name).eq('test');
            expect(func.selfRef.semanticId).eq('test');
            expect(func.selfRef.mainSemanticId).eq('test');
        } else {
            expect.fail();;
        }
    });

    it('reflect class semanticId and name', () => {
        if (isClassReflection(cls)) {
            expect(cls.name).eq('Test');
            expect(cls.selfRef.semanticId).eq('Test');
            expect(cls.selfRef.mainSemanticId).eq('Test');
        } else {
            expect.fail();;
        }
    });
});
