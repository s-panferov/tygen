import * as path from 'path';
import * as fs from 'fs';
import { generateModule } from '../test';

export { expect } from 'chai';
export { inspect } from '../tools';

import * as uuid from 'node-uuid';

import { isTypeReferenceReflection } from '../ast/type';
import { Item } from '../items';

export function typeRef(item: Item): string {
    if (isTypeReferenceReflection(item)) {
        return item.ref;
    } else {
        throw new Error('item is not type reference');
    }
}

export function filePath(file: string) {
    return path.join(process.cwd(), 'src', 'doc', 'tests', file);
}

export function generate(file: string) {
    return generateModule(filePath(file));
}

export function rmDir(dirPath) {
    let files = [];
    files = fs.readdirSync(dirPath);
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            let filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile()) {
                if (filePath.indexOf('gitkeep') === -1) {
                    fs.unlinkSync(filePath);
                }
            } else {
                rmDir(filePath);
            }
        }
    }
};

export function generateInline(source: string) {
    let tmpDir = path.join(process.cwd(), 'tmp');
    rmDir(tmpDir);
    let tmpPath = path.join(tmpDir, uuid.v1() + '.ts');
    fs.writeFileSync(tmpPath, source);

    return generateModule(tmpPath);
}
