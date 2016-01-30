import * as path from 'path';
import { expect } from 'chai';

import { generateModule } from '../test';
import { filePath } from './utils';

let doc = generateModule(filePath('simple.ts'));
describe('simple.ts', () => {
    it('works', () => {
        console.log(doc);
    });
});
