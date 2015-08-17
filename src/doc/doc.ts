import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import * as lunr from 'lunr';

import SyntaxKind = ts.SyntaxKind;
import TypeChecker = ts.TypeChecker;
import SourceFile = ts.SourceFile;
import Node = ts.Node;
import Type = ts.Type;
import Symbol = ts.Symbol;

let fse = require('fs-extra');
let closest = require('closest-package');

export interface DocMap {
    [key: string]: Doc
}

export interface DocIndex {
    mainPackage: string;
    files: DocMap
}

export interface PackageDef {
    info: any;
    path: string;
}

export interface DocPkgInfo {
    name: string;
    version: string;
    description: string;
}

export interface Doc {
    text: string;
    pkg: DocPkgInfo;
    fileInfo: DocFileDef;
}

export interface DocFileDef {
    relativeToOrigin: string;
    relativeToPackage: string;
    metaName: string;
}

export class DocRegistry {
    docs: DocMap = {};

    addDoc(fileName, doc: DocRuntime) {
        this.docs[fileName] = doc;
    }

    writeDocs(dir: string) {
        fse.ensureDirSync(dir);
        _.forEach(this.docs, (doc) => {
            let metaPath = path.join(dir, doc.fileInfo.metaName);
            fs.writeFileSync(metaPath, JSON.stringify(doc, null, 4));
        });

        this.writeRegistryModule(dir)
    }

    generateRegistryModule(dir: string): string {
        let buf = `
module.exports = {\n
    mainPackage: '${extractPackage(dir).info.name}',
    files: {
        `;

        _.forEach(this.docs, (doc) => {
            buf += `    '${doc.fileInfo.metaName}': require('./${ doc.fileInfo.metaName }'),\n`
        });

        buf += '}}';

        return buf;
    }

    writeRegistryModule(dir: string) {
        let registryModule = this.generateRegistryModule(dir);
        fs.writeFileSync('./docs/registry.js', registryModule);
    }
}

export function extractPackage(fileName: string): PackageDef {
    let pkgJson = closest.sync(path.dirname(fileName));
    return {
        path: path.dirname(pkgJson),
        info: JSON.parse(fs.readFileSync(pkgJson).toString())
    }
}

export function getDocFilePath(fileName: string, pkg: PackageDef): DocFileDef {
    let relativeToOrigin = path.relative(process.cwd(), fileName);

    let shasum = crypto.createHash('sha1');
    shasum.update(relativeToOrigin);

    let metaName = shasum.digest('hex') + '.json';
    let relativeToPackage = path.relative(pkg.path, fileName);

    if (!/^(\.|\/)/.test(relativeToPackage)) {
        relativeToPackage = '/' + relativeToPackage
    }

    return {
        metaName,
        relativeToOrigin,
        relativeToPackage
    }
}

class DocRuntime implements Doc {
    text: string;
    pkg: DocPkgInfo;
    fileInfo: DocFileDef;

    constructor(sourceFile: SourceFile, pkg: PackageDef, fileInfo: DocFileDef) {
        this.text = sourceFile.text;
        this.pkg = {
            name: pkg.info.name,
            version: pkg.info.version,
            description: pkg.info.description,
        };
        this.fileInfo = fileInfo;
    }

    toJSON() {
        let { text, pkg, fileInfo } = this;
        return { pkg, fileInfo, text };
    }
}

export function generateDoc(fileName: string, source: SourceFile): DocRuntime {
    let pkg = extractPackage(fileName);
    let docFilePath = getDocFilePath(fileName, pkg);

    let doc = new DocRuntime(source, pkg, docFilePath);
    return doc;
}
