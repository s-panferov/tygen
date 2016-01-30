import * as path from 'path';
import * as fs from 'fs';
import { generateModule } from '../test';

export { expect } from 'chai';
export { inspect } from '../tools';

import * as uuid from 'node-uuid';

export function filePath(file: string) {
    return path.join(process.cwd(), 'src', 'doc', 'tests', file);
}

export function generate(file: string) {
    return generateModule(filePath(file));
}

export function generateInline(source: string) {
    let tmpPath = path.join(process.cwd(), 'tmp', uuid.v1() + '.ts');
    fs.writeFileSync(tmpPath, source);

    return generateModule(tmpPath);
}
