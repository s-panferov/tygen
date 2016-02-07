import MemoryFileSystem from 'memory-fs';
import { DocRegistry, PackageInfo, Module } from '../doc/index';
import { Maybe } from 'tsmonad';

import * as path from 'path';

export interface Route {
    pkg: string;
    path: string;
}

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

    getModule(route: Route): Maybe<Module> {
        if (!route.pkg) {
            return Maybe.nothing<Module>();
        } else {
            let pkg = this.getPackage(route.pkg);
            let module = pkg.files[route.path];
            if (module) {
                return Maybe.just(module);
            } else {
                return Maybe.nothing<Module>();
            }
        }
    }

    getFileStructure(route: Route): FileStructure {
        let pkg = this.getPackage(route.pkg);
        let targetPath = route.path;
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
