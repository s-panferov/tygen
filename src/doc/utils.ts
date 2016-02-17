import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

import { Package, FileInfo } from './index';

let closest = require('pkg-up');

export function extractPackage(fileName: string): Package {
    let pkgJson = closest.sync(path.dirname(fileName));
    return {
        path: path.dirname(pkgJson),
        info: JSON.parse(fs.readFileSync(pkgJson).toString())
    };
}

export function getFileInfo(fileName: string, pkg: Package): FileInfo {
    let relativeToOrigin = path.relative(process.cwd(), fileName);

    let shasum = crypto.createHash('sha1');
    shasum.update(relativeToOrigin);

    let metaName = shasum.digest('hex') + '.json';
    let relativeToPackage = path.relative(pkg.path, fileName);

    if (!/^(\.|\/)/.test(relativeToPackage)) {
        relativeToPackage = '/' + relativeToPackage;
    }

    let withPackage = pkg.info.name + '://' + relativeToPackage;

    return {
        metaName,
        relativeToPackage,
        withPackage
    };
}

export function logNode(node) {
    let obj = Object.assign({}, node);
    delete obj.parent;
    return console.log(obj);
}
