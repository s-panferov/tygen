import MemoryFileSystem from 'memory-fs';
import { DocRegistry, PackageInfo, ModuleInfo } from '../doc/index';
import { Maybe } from 'tsmonad';

import * as path from 'path';

export interface Route {
    pkg?: string;
    path?: string;
    id?: string;
    mainId?: string;
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
    files: Dictionary<string>;
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

    getModuleMetaName(route: Route): Maybe<string> {
        if (!route.pkg) {
            return Maybe.nothing();
        } else {
            let pkg = this.getPackage(route.pkg);
            return Maybe.maybe(pkg.files[route.path]);
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
                let [semanticId, pkg, path, nesting] = finalRoute;
                return {
                    id: route.id,
                    mainId: nesting[0],
                    semanticId,
                    pkg,
                    path,
                    nesting
                };
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
        let moduleMetaName = registry.files[key];

        let [pkgName, relativeToPackage] = key.split('://');

        let pkg = packages[pkgName];
        pkg.files[relativeToPackage] = moduleMetaName;
        pkg.fs.mkdirpSync(path.dirname(relativeToPackage));
        pkg.fs.writeFileSync(relativeToPackage, moduleMetaName);
    });

    return packages;
}
