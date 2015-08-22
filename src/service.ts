import * as _ from 'lodash';
import * as path from 'path';

import allRecords from './records';
import { List, Map } from 'immutable';

import {
    DocR,
    Doc,
    PackageR,
    Package,
    DocPkgInfo,
    DocIndexR,
    DocIndex
} from './state-i';

import MemoryFileSystem from 'memory-fs';
let { filter } = require('fuzzaldrin');

interface FileStructure {
    currentName: string;
    prevExists: boolean;
    dirPath: string;
    prevPath: string,
    prevName: string,
    files: string[],
    folders: string[],
    isFile: boolean;
}

export interface SearchIndexDoc {
    searchPath: string,
    doc: DocR
}

export interface SearchIndex {
    files: SearchIndexDoc[]
}

export class Service {
    index: DocIndexR;
    packages: Map<string, PackageR>;
    searchIndex: SearchIndex = {
        files: []
    }

    constructor(registry: DocIndex) {
        this.index = DocIndexR.fromJS(registry, allRecords);
        this.packages = readPackages(registry, this.searchIndex);
    }

    getMainPackageName(): string {
        return this.index.mainPackage;
    }

    getMainPackage(): PackageR {
        return this.packages.get(this.getMainPackageName())
    }

    getPackage(pkgName: string): PackageR {
        return this.packages.get(pkgName);
    }

    getPackages(): Map<string, PackageR> {
        return this.packages;
    }

    searchFiles(query: string): List<DocR> {
        let results: SearchIndexDoc[] = filter(this.searchIndex.files, query, {
            key: 'searchPath'
        });

        return List(results.map(res => res.doc));
    }
}

function readPackages(registry: DocIndex, searchIndex: SearchIndex): Map<string, PackageR> {
    let rawPackages: { [key: string]: Package } = {};

    _.forEach(registry.files, (doc: Doc) => {
        let pkg;
        if (!rawPackages[doc.pkg.name]) {
            pkg = rawPackages[doc.pkg.name] = <any>{
                files: {},
                fs: new MemoryFileSystem()
            };
        } else {
            pkg = rawPackages[doc.pkg.name];
        }

        pkg.info = doc.pkg;
        pkg.files[doc.fileInfo.relativeToPackage] = doc;
        pkg.fs.mkdirpSync(path.dirname(doc.fileInfo.relativeToPackage));
        pkg.fs.writeFileSync(doc.fileInfo.relativeToPackage, JSON.stringify(doc.fileInfo));
    });

    let packages = {};
    for (let pkgName in rawPackages) {
        let packageR = PackageR.fromJS(rawPackages[pkgName], allRecords);
        packages[pkgName] = packageR;

        searchIndex.files = searchIndex.files.concat(
            packageR.files.valueSeq().map(doc => {
                return {
                    searchPath: doc.fileInfo.withPackage,
                    doc
                }
            }).toJS()
        )
    }

    return Map<string, PackageR>(packages);
}

export function getFileStructure(pkg: PackageR, targetPath: string): FileStructure {
    var stat = pkg.fs.statSync(targetPath);

    var dirPath: string;
    var isFile = false;
    if (stat.isDirectory()) {
        dirPath = targetPath;
    } else {
        dirPath = path.dirname(targetPath);
        isFile = true;
    }

    let dir = pkg.fs.readdirSync(dirPath);
    let prevPath = path.dirname(dirPath);
    let prevExists = prevPath !== dirPath;

    let structure: FileStructure = {
        currentName: path.basename(targetPath),
        isFile,
        dirPath,
        prevPath,
        prevName: path.basename(prevPath),
        prevExists,
        files: dir.filter((item) => pkg.fs.statSync(path.join(dirPath, item)).isFile()),
        folders: dir.filter((item) => pkg.fs.statSync(path.join(dirPath, item)).isDirectory()),
    };

    return structure;
}
