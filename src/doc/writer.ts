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
                idMap[obj.id] = {
                    id: obj.id,
                    semanticId: obj.semanticId,
                    pkg,
                    path,
                    nesting
                };

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
            module.items.forEach(item => {
                walkObject(item, module.pkg.info.name, module.fileInfo.relativeToPackage);
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
        });

        this.writeRegistryModule(dir);
    }

    generateRegistryModule(dir: string): string {
        let idMap = this.generateIdMap();
        let buf = `
module.exports = {\n
    mainPackage: '${extractPackage(dir).info.name}',
    idMap: ${ JSON.stringify(idMap[0], null, 4) },
    semanticIdMap: ${ JSON.stringify(idMap[1], null, 4) },
    files: {
        `;

        let modules = this.context.modules;
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            buf += `    '${module.fileInfo.relativeToPackage}': require('./${ module.fileInfo.metaName }'),\n`;
        });

        buf += '}}';

        return buf;
    }

    writeRegistryModule(dir: string) {
        let registryModule = this.generateRegistryModule(dir);
        fs.writeFileSync(path.join(dir, 'registry.js'), registryModule);
    }
}
