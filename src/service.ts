import { Doc, DocIndex, DocPkgInfo } from './doc/doc';
import * as _ from 'lodash';
import * as path from 'path';

import MemoryFileSystem from 'memory-fs';

export interface PackageMap {
    [key: string]: Package
}

export interface Package {
    info: DocPkgInfo,
    files: { [key: string]: Doc },
    docs: Doc[],
    fs: MemoryFileSystem
}

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

export class Service {
    index: DocIndex;
    packages: PackageMap;

    constructor(registry: DocIndex) {
        this.index = registry;
        this.packages = readPackages(registry);
    }

    getMainPackageName(): string {
        return this.index.mainPackage;
    }

    getMainPackage(): Package {
        return this.packages[this.getMainPackageName()]
    }

    getPackage(pkgName: string) {
        return this.packages[pkgName];
    }

    getPackages(): PackageMap {
        return this.packages;
    }
}

function readPackages(registry: DocIndex): PackageMap {
    let packages: PackageMap = {};
    _.forEach(registry.files, (doc: Doc) => {
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

export function getFileStructure(pkg: Package, targetPath: string): FileStructure {
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
