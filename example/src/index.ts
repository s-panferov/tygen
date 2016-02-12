import { Test } from './test';

interface UserName extends Test<Promise<string>, string> {
    test: Test<Promise<string>, Test<Promise<string>, number>>;
}
