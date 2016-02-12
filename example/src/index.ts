import { Test } from './test';

/**
 * Simple interface to describe UserName
 */
interface UserName extends Test<Promise<string>, string> {
    test: Test<Promise<string>, Test<Promise<string>, number>>;
}

/**
 * Simple class to describe SuperName
 */
class SuperName extends Promise<string> {

}
