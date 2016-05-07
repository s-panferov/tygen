import MemoryFileSystem from 'memory-fs';
import { DocRegistry, PackageInfo } from '../doc/index';
import { Settings } from './settings';
import { ModuleInfo, Item } from '../doc';
import { inflateJson } from '../lib/inflate';
import { getMetaName } from '../doc/utils';

import * as path from 'path';

export interface Route {
    id?: string;
    semanticId?: string;

    pkg?: string;
    path?: string;

    mainId?: string;
    mainSemanticId?: string;

    invalid?: boolean;
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

export interface ModuleMeta {
    shortForm: boolean;
    moduleMetaName: string;
}

export interface PackageService {
    info: PackageInfo;
    files: Dictionary<ModuleMeta>;
    fs: MemoryFileSystem;
}

interface Packages {
    [name: string]: PackageService;
}

export default class Service {
    registry: DocRegistry;
    packages: Packages;
    settings: Settings;

    items: { [key: string]: Item } = {};
    modules: { [key: string]: ModuleInfo } = {};

    constructor(registry: DocRegistry, settings: Settings) {
        this.registry = registry;
        this.settings = settings;
        this.packages = readPackages(registry);
    }

    ensureRoute(route: Route): Promise<{ item: Item, module: ModuleInfo }> {
        let meta = this.getModuleMeta(route);
        let promise: Promise<any>;
        let itemId: string;

        if (!meta || !meta.moduleMetaName) {
            promise = Promise.resolve();
        } else {
            let { shortForm, moduleMetaName } = meta;
            let promises: Promise<any>[] = [];
            itemId = route.mainSemanticId || route.semanticId || route.id;

            if (!this.modules[moduleMetaName]) {
                // load module meta info
                let promise = fetch(`${this.settings.docRoot}/${moduleMetaName}.gz`)
                    .then(res => inflateJson(res))
                    .then((moduleInfo) => {
                        this.modules[moduleMetaName] = moduleInfo as any;
                        if (itemId && shortForm) {
                            this.items[itemId] = moduleInfo.itemsIndex[moduleInfo.semanticIdMap[itemId]];
                        }
                    });

                promises.push(promise);
            } else {
                if (itemId && shortForm) {
                    let moduleInfo = this.modules[moduleMetaName];
                    this.items[itemId] = moduleInfo.itemsIndex[moduleInfo.semanticIdMap[itemId]];
                }
            }

            if (!shortForm && itemId) {
                if (!this.items[itemId]) {
                    let promise = fetch(`${this.settings.docRoot}/${moduleMetaName.replace('.json', '')}/${itemId}.json.gz`)
                        .then(res => inflateJson(res))
                        .then((item: Item) => {
                            this.items[itemId] = item;
                        });

                    promises.push(promise);
                }
            }

            promise = Promise.all(promises) as Promise<any>;
        }

        return promise
            .then(() => {
                return {
                    item: itemId && this.items[itemId],
                    module: meta && this.modules[meta.moduleMetaName]
                };
            })
            .catch(e => { console.error(e.toString()); throw e; });
    }

    getMainPackageName(): string {
        return this.registry.mainPackage;
    }

    getMainPackage(): PackageService {
        return this.getPackage(this.getMainPackageName());
    }

    getDefaultRoute(): Route {
        let mainPackage = this.getMainPackage();
        let route = {
            pkg: this.getMainPackageName(),
            path: '/'
        };

        let docscript = mainPackage.info.docscript;
        if (docscript) {
            if (docscript.defaultPath) {
                route.path = docscript.defaultPath;
            }
        }
        return route;
    }

    getPackage(pkgName: string): PackageService {
        return this.packages[pkgName];
    }

    getPackages(): Packages {
        return this.packages;
    }

    getModuleMeta(route: Route): ModuleMeta {
        if (!route.pkg) {
            return null;
        } else {
            let pkg = this.getPackage(route.pkg);
            return pkg.files[route.path];
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

            // for packages like 'somename/lib/smth'
            let mainName = packageName.split('/')[0];
            packages[mainName] = <any>{
                files: {},
                info: packageInfo,
                fs: new MemoryFileSystem()
            };
        }
    });

    Object.keys(registry.files).forEach(key => {
        let moduleMetaName = getMetaName(key);
        let [pkgName, relativeToPackage] = key.split('://');

        let pkgNameParts = pkgName.split('/');
        let mainPkgName = pkgNameParts[0];
        let pkg = packages[mainPkgName];

        if (mainPkgName !== pkgName) {
            // for packages like 'somename/lib/smth'
            relativeToPackage = '/' + pkgNameParts.slice(1).join('/') + relativeToPackage;
        }

        let fileInfo: ModuleMeta = {
            shortForm: registry.files[key],
            moduleMetaName
        };

        pkg.files[relativeToPackage] = fileInfo;
        pkg.fs.mkdirpSync(path.dirname(relativeToPackage));

        let modulePath = relativeToPackage;
        try {
            pkg.fs.writeFileSync(modulePath, moduleMetaName);
        } catch (e) {

        }
    });

    return packages;
}

export function pathFromRoute(route: Route): string {
    let routeUrl = `/${route.pkg}${route.path}`;

    if (route.semanticId) {
        routeUrl += '?sid=' + route.semanticId;
        let mainSid = route.mainSemanticId || route.mainId;
        if (mainSid && mainSid !== route.semanticId && mainSid !== route.id) {
            routeUrl += '&in=' + mainSid;
        }
    } else if (route.id) {
        routeUrl += '?id=' + route.id;
        let mainSid = route.mainSemanticId || route.mainId;
        if (mainSid && mainSid !== route.semanticId && mainSid !== route.id) {
            routeUrl += '&in=' + mainSid;
        }
    }

    return routeUrl;
}

export function routeFromPath(urlPath: string, query: any, service: Service): Route {
    let parts = urlPath.split('/').filter(Boolean);
    let pkg = parts[0];
    let path = '/' + parts.slice(1).join('/');
    let id = query.id;
    let semanticId = query.sid;
    let mainSemanticId = query.in;

    return {
        pkg,
        path,
        id,
        semanticId,
        mainSemanticId
    };
}
