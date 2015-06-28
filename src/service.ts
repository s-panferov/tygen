import { IDoc, IDocRegistry, IDocPkgInfo } from 'awesome-typescript-loader/src/doc/doc';
import * as _ from 'lodash';
import * as path from 'path';

import MemoryFileSystem = require('memory-fs');

export interface IPackageMap {
    [key: string]: IPackage
}

export interface IPackage {
    info: IDocPkgInfo,
    files: { [key: string]: IDoc },
    docs: IDoc[],
    fs: MemoryFileSystem
}

interface IFileStructure {
    currentName: string;
    prevExists: boolean;
    prevPath: string,
    prevName: string,
    files: string[],
    folders: string[]
}

export class Service {
    registry: IDocRegistry;
    packages: IPackageMap;

    constructor(registry: IDocRegistry) {
        this.registry = registry;
        this.packages = readPackages(registry);
    }

    getMainPackageName(): string {
        return this.registry.mainPackage;
    }

    getMainPackage(): IPackage {
        return this.packages[this.getMainPackageName()]
    }

    getPackage(pkgName: string) {
        return this.packages[pkgName];
    }

    getPackages(): IPackageMap {
        return this.packages;
    }
}

function readPackages(registry: IDocRegistry): IPackageMap {
    let packages: IPackageMap = {};
    _.forEach(registry.files, (doc: IDoc) => {
        let pkg;
        if (!packages[doc.pkg.name]) {
            pkg = packages[doc.pkg.name] = <any>{ files: {}, docs: [], fs: new MemoryFileSystem() };
        } else {
            pkg = packages[doc.pkg.name];
        }

        pkg.info = doc.pkg;
        pkg.files[doc.fileInfo.relativeToPackage] = doc;
        pkg.docs.push(doc);
        pkg.fs.mkdirpSync(path.dirname(doc.fileInfo.relativeToPackage));
        pkg.fs.writeFileSync(doc.fileInfo.relativeToPackage, JSON.stringify(doc.fileInfo))
    });

    return packages;
}

export function getFileStructure(pkg: IPackage, targetPath: string): IFileStructure {
    let dir = pkg.fs.readdirSync(targetPath);

    let prevPath = path.dirname(targetPath);
    let prevExists = prevPath !== targetPath;

    let structure: IFileStructure = {
        currentName: path.basename(targetPath),
        prevPath,
        prevName: path.basename(prevPath),
        prevExists,
        files: dir.filter((item) => pkg.fs.statSync(path.join(targetPath, item)).isFile()),
        folders: dir.filter((item) => pkg.fs.statSync(path.join(targetPath, item)).isDirectory()),
    };

    return structure;
}