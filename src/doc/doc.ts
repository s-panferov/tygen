import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import SyntaxKind = ts.SyntaxKind;
import TypeChecker = ts.TypeChecker;
import SourceFile = ts.SourceFile;
import Node = ts.Node;
import Type = ts.Type;
import Symbol = ts.Symbol;

let fse = require('fs-extra');
let closest = require('closest-package');

export interface IDocMap {
    [key: string]: IDoc
}

export interface IDocRegistry {
    mainPackage: string;
    files: IDocMap
}

export class DocRegistry {
    docs: IDocMap = {};

    addDoc(fileName, doc: Doc) {
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

export interface IPackage {
    info: any;
    path: string;
}

export function extractPackage(fileName: string): IPackage {
    let pkgJson = closest.sync(path.dirname(fileName));
    return {
        path: path.dirname(pkgJson),
        info: JSON.parse(fs.readFileSync(pkgJson).toString())
    }
}

export interface IDocFile {
    relativeToOrigin: string;
    relativeToPackage: string;
    metaName: string;
}

export function getDocFilePath(fileName: string, pkg: IPackage): IDocFile {
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

export interface IDocPkgInfo {
    name: string;
    version: string;
    description: string;
}

export interface IDoc {
    text: string;
    pkg: IDocPkgInfo;
    fileInfo: IDocFile;
}

class Doc implements IDoc {
    text: string;
    pkg: IDocPkgInfo;
    fileInfo: IDocFile;

    constructor(sourceFile: SourceFile, pkg: IPackage, fileInfo: IDocFile) {
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

export function generateDoc(fileName: string, source: SourceFile): Doc {
    let pkg = extractPackage(fileName);
    let docFilePath = getDocFilePath(fileName, pkg);

    let doc = new Doc(source, pkg, docFilePath);
    return doc;
}
