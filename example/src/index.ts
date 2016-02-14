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

}
