import MemoryFileSystem from 'memory-fs';
import { DocRegistry, PackageInfo, ModuleInfo } from '../doc/index';
import { Maybe } from 'tsmonad';

import * as path from 'path';

export interface Route {
    pkg?: string;
    path?: string;
    id?: string;
    semanticId?: string;
    nesting?: string[];
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
    files: Dictionary<ModuleInfo>;
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

    getModule(route: Route): Maybe<ModuleInfo> {
        if (!route.pkg) {
            return Maybe.nothing<ModuleInfo>();
        } else {
            let pkg = this.getPackage(route.pkg);
            let module = pkg.files[route.path];
            if (module) {
                return Maybe.just(module);
            } else {
                return Maybe.nothing<ModuleInfo>();
            }
        }
    }

    getIdBySemanticId(pkg: string, path: string, semanticId: string): string {
        return this.registry.semanticIdMap[pkg][path][semanticId];
    }

    getFullRoute(route: Route): Route {
        if (route.id && !route.pkg) {
            // know only id, need to fill all other info
            let finalRoute = this.registry.idMap[route.id];

            if (finalRoute) {
                return finalRoute;
            } else {
                console.error(`Unknown id ${ route.id }`);
                return {
                    pkg: this.getMainPackageName(),
                    path: '/'
                };
            }
        } else {
            return route;
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

    Object.keys(registry.packages).forEach(packageName => {
        if (!packages[packageName]) {
            let packageInfo = registry.packages[packageName];
            packages[packageName] = <any>{
                files: {},
                info: packageInfo,
                fs: new MemoryFileSystem()
            };
        }
    });

    Object.keys(registry.files).forEach(key => {
        let module = registry.files[key];
        let pkgName = module.pkgName;
        let pkg = packages[pkgName];

        pkg.files[module.fileInfo.relativeToPackage] = module;
        pkg.fs.mkdirpSync(path.dirname(module.fileInfo.relativeToPackage));
        pkg.fs.writeFileSync(module.fileInfo.relativeToPackage, JSON.stringify(module.fileInfo));
    });

    return packages;
}
