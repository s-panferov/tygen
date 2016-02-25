import * as path from 'path';
import * as fs from 'fs';
import { Context, IdMap, SemanticIdMap } from './index';
import { extractPackage } from './utils';

let fse = require('fs-extra');

export class DocWriter {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    generateIdMap(): [IdMap, SemanticIdMap] {
        let idMap = {} as IdMap;
        let semanticIdMap = {} as SemanticIdMap;

        function walkObject(obj: any, pkg: string, path: string, nesting: string[] = []) {
            if (obj.id) {
                nesting = nesting.concat(obj.id);
                idMap[obj.id] = [obj.semanticId, pkg, path, [nesting[0]]];

                if (obj.semanticId) {
                    if (!semanticIdMap[pkg]) { semanticIdMap[pkg] = {}; };
                    if (!semanticIdMap[pkg][path]) { semanticIdMap[pkg][path] = {}; };
                    if (!semanticIdMap[pkg][path][obj.semanticId]) { semanticIdMap[pkg][path][obj.semanticId] = obj.id; }
                    else {
                        console.error('Duplicate semantic id ' + obj.semanticId);
                    }
                }
            }

            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let o = obj[key];
                    if (o != null &&
                        typeof o === 'object' &&
                        (Array.isArray(o) ||
                        Object.prototype.toString.call(o) === '[object Object]')) {
                            walkObject(o, pkg, path, nesting);
                        }
                }
            }
        }

        let modules = this.context.modules;
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            Object.keys(module.items).forEach(itemId => {
                let item = module.items[itemId];
                walkObject(item, module.pkgName, module.fileInfo.relativeToPackage);
            });
        });

        return [idMap, semanticIdMap];
    }

    writeModules(dir: string) {
        fse.removeSync(dir);
        fse.ensureDirSync(dir);

        let modules = this.context.modules;
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            let metaPath = path.join(dir, module.fileInfo.metaName);
            fs.writeFileSync(metaPath, JSON.stringify(module, null, 4));

            let itemsPath = metaPath.replace('.json', '');
            fse.ensureDirSync(itemsPath);
            Object.keys(module.items).forEach(itemId => {
                let itemPath = path.join(itemsPath, itemId + '.json');
                fs.writeFileSync(itemPath, JSON.stringify(module.items[itemId], null, 4));
            });
        });

        this.writeRegistryModule(dir);
    }

    generateRegistryModule(dir: string): string {
        let [idMap, semanticIdMap] = this.generateIdMap();
        let modules = this.context.modules;
        let files: any = {};
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            files[module.fileInfo.withPackage] = module.fileInfo.metaName;
        });

        let buf = `
{\n
    "mainPackage": "${extractPackage(dir).info.name}",
    "packages": ${ JSON.stringify(this.context.packages, null, 4) },
    "files": ${ JSON.stringify(files, null, 4) },
    "idMap": ${ JSON.stringify(idMap) },
    "semanticIdMap": ${ JSON.stringify(semanticIdMap) }
}`;

        return buf;
    }

    writeRegistryModule(dir: string) {
        let registryModule = this.generateRegistryModule(dir);
        fs.writeFileSync(path.join(dir, 'registry.json'), registryModule);
    }
}
