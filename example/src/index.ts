import { Generic } from './test';
import { Test2 } from './test2';
import { } from './ns';

/**
 * Simple interface to describe UserName
 */
interface UserName extends Generic<Promise<string>, string> {
    test: Generic<Promise<string>, Generic<Promise<string>, number>>;
    foo: <T>(a: T, b: number) => Promise<T>;
}

/**
 * Simple class to describe SuperName
 */
class SuperName extends Promise<string> {
    constructor(a: any) {
        super(a);
    }

    method(x: Generic<Promise<string>, number>): Test2 {
        return null;
    }

    get name(): string {
        return null;
    }
    set name(val: string) {
    }
}
