import * as path from 'path';
import { expect } from 'chai';

import { generateModule } from '../test';
import { filePath } from './utils';
import { inspect } from '../tools';

let doc = generateModule(filePath('simple.ts'));
describe('simple.ts', () => {
    it('works', () => {
        inspect(doc.items as any)
    });
});
