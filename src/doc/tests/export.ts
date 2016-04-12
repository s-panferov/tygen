import { generateInline, expect } from './utils';
import {
    StatementReflection
} from '../ast/type';

describe('export test', () => {
    let module = generateInline(`
        export type Alias<T> = T | Promise<T>
        export interface Iface { }
        export default class Class { }
        export enum Enum { }
        export const a = 1, b = 2;
    `);

    let def = module.items[2];

    it('reflection', () => {
        expect(module.items).lengthOf(6);
        expect((def as StatementReflection).default).true;
        module.items.forEach((item: StatementReflection) => {
            expect(item.exported).true;
        });
    });
});
