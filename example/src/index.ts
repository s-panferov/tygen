import { Test } from './test';

/**
 * Simple interface to describe UserName
 */
interface UserName extends Test<Promise<string>, string> {
    test: Test<Promise<string>, Test<Promise<string>, number>>;
    foo: <T>(a: T, b: number) => Promise<T>;
}

/**
 * Simple class to describe SuperName
 */
class SuperName extends Promise<string> {
    constructor(a: any) {
        super(a);
    }

    method(x: Test<Promise<string>, number>): Test<any, any> {
        return null;
    }

    get name(): string {
        return null;
    }
    set name(val: string) {
    }
}
