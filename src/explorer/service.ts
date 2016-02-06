import MemoryFileSystem from 'memory-fs';
import { DocRegistry, PackageInfo, Module } from '../doc/index';

import * as path from 'path';

interface FileStructure {
    currentName: string;
    prevExists: boolean;
    dirPath: string;
    prevPath: string;
    prevName: string;
    files: string[];
    folders: string[];
    isFile: boolean;
}

export interface PackageService {
    info: PackageInfo;
    files: Dictionary<Module>;
    fs: MemoryFileSystem;
}

interface Packages {
    [name: string]: PackageService;
}

export default class Service {
    registry: DocRegistry;
    packages: Packages;

    constructor(registry: DocRegistry) {
        this.registry = registry;
        this.packages = readPackages(registry);
    }

    getMainPackageName(): string {
        return this.registry.mainPackage;
    }

    getMainPackage(): PackageService {
        return this.getPackage(this.getMainPackageName());
    }

    getPackage(pkgName: string): PackageService {
        return this.packages[pkgName];
    }

    getPackages(): Packages {
        return this.packages;
    }
}

function readPackages(registry: DocRegistry): Packages {
    let packages: Packages = {};

    Object.keys(registry.files).forEach(key => {
        let module = registry.files[key];
        let pkg;
        let name = module.pkg.info.name;
        if (!packages[name]) {
            pkg = packages[name] = <any>{
                files: {},
                fs: new MemoryFileSystem()
            };
        } else {
            pkg = packages[name];
        }

        pkg.info = module.pkg.info;
        pkg.files[module.fileInfo.relativeToPackage] = module;
        pkg.fs.mkdirpSync(path.dirname(module.fileInfo.relativeToPackage));
        pkg.fs.writeFileSync(module.fileInfo.relativeToPackage, JSON.stringify(module.fileInfo));
    });

    return packages;
}

export function getFileStructure(pkg: PackageService, targetPath: string): FileStructure {
    let stat = pkg.fs.statSync(targetPath);

    let dirPath: string;
    let isFile = false;
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
