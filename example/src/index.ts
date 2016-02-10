import { Test } from './test';

interface UserName {
    test: Test<UserName, Test<string, number>>;
}
