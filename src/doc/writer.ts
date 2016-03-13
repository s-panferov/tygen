import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { ItemType } from './items';
import { Context, IdMap, SemanticIdMap } from './index';
import { extractPackage } from './utils';

let fse = require('fs-extra');

let INCLUDE_ITEMS = {
    [ItemType.Interface]: true,
    [ItemType.Class]: true,
    [ItemType.EnumDeclaration]: true,
    [ItemType.TypeAlias]: true,
    [ItemType.Function]: true,
    [ItemType.Method]: true,
    [ItemType.PropertyDeclaration]: true,
};

export class DocWriter {
    context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    generateIdMap(): [IdMap, SemanticIdMap, any[]] {
        let idMap = {} as IdMap;
        let semanticIdMap = {} as SemanticIdMap;
        let flatItems: any[] = [];

        function walkObject(
            obj: any,
            pkg: string,
            path: string,
            inMain: boolean,
            nesting: string[] = []
        ) {
            if (obj.id) {
                nesting = nesting.concat(obj.id);

                // if (!!idMap[obj.id]) {
                //     console.log('origin', idMap[obj.id]);
                //     console.log('new', obj, nesting);
                //     console.log('nest', idMap[nesting[1]]);
                //     console.log('========================', obj);
                //     throw '!!dublicate';
                // }

                idMap[obj.id] = [obj.semanticId, pkg, path, [nesting[0]]];

                if (inMain && INCLUDE_ITEMS[obj.itemType]) {
                    flatItems.push(obj);
                }

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
                            walkObject(o, pkg, path, inMain, nesting);
                        }
                }
            }
        }

        let modules = this.context.modules;
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            let inMain = module.pkgName == this.context.mainPackage;

            module.items.forEach(item => {
                walkObject(
                    item,
                    module.pkgName,
                    module.fileInfo.relativeToPackage,
                    inMain
                );
            });
        });

        return [idMap, semanticIdMap, flatItems];
    }

    ensureDir(dir: string) {
        fse.removeSync(dir);
        fse.ensureDirSync(dir);
    }

    writeModules(dir: string): Promise<any> {
        this.ensureDir(dir);

        let modules = this.context.modules;
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            let metaPath = path.join(dir, module.fileInfo.metaName);
            fs.writeFileSync(metaPath, JSON.stringify(module, null, 4));

            let itemsPath = metaPath.replace('.json', '');
            fse.ensureDirSync(itemsPath);
            Object.keys(module.itemsIndex).forEach(itemId => {
                let itemPath = path.join(itemsPath, itemId + '.json');
                fs.writeFileSync(itemPath, JSON.stringify(module.itemsIndex[itemId], null, 4));
            });
        });

        let [regModule, flatItems] = this.generateRegistryModule(dir);
        fs.writeFileSync(path.join(dir, 'registry.json'), regModule);

        return this.deflate(dir)
            .then(() => {
                return this.generateSearchIndex(dir, flatItems, () => {});
            });
    }

    deflate(dir): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('spawn gzip');
            let gzip = spawn('gzip', [ '-r', '-9', dir ]);

            gzip.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });

            gzip.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });

            gzip.on('close', (code) => {
              console.log(`gzip exited with code ${code}`);
              resolve();
            });
        });
    }

    generateSearchIndex(dir: string, flatItems: any[], cb: () => void): Promise<any> {
        let SearchIndex = require('search-index');
        let options = {
            db: require('memdown'),
            deletable: false,
            fieldedSearch: false,
            indexPath: 'si',
            logLevel: 'error',
            nGramLength: 1,
            fieldsToStore: [ 'semanticId' ]
        };

        let indexOptions = {
            batchName: 'items',
            fieldOptions: [
                {
                    fieldName: 'semanticId'
                }
            ]
        };

        return new Promise((resolve, reject) => {
            SearchIndex(options, (err, index) => {
                console.log('search index initialized');
                index.add(flatItems, indexOptions, function(err) {
                    console.log('creating index snapshot...');
                    index.snapShot(function(readStream) {
                        readStream.pipe(fs.createWriteStream(path.join(dir, 'search-index.gz')))
                            .on('close', function() {
                            console.log('snapshot completed');
                            cb();
                            resolve();
                        });
                    });
                });
            });
        });
    }

    generateRegistryModule(dir: string): [string, any[]] {
        let [idMap, semanticIdMap, flatItems] = this.generateIdMap();
        let modules = this.context.modules;
        let files: any = {};
        Object.keys(modules).forEach(moduleKey => {
            let module = modules[moduleKey];
            files[module.fileInfo.withPackage] = module.fileInfo.metaName;
        });

        let packagesInfo = {};
        for (let key of Object.keys(this.context.packages)) {
            packagesInfo[key] = this.context.packages[key].info;
        }

        let buf = `
{\n
    "mainPackage": "${extractPackage(dir).info.name}",
    "packages": ${ JSON.stringify(packagesInfo, null, 4) },
    "files": ${ JSON.stringify(files, null, 4) },
    "idMap": ${ JSON.stringify(idMap, null, 4) },
    "semanticIdMap": ${ JSON.stringify(semanticIdMap, null, 4) }
}`;

        return [buf, flatItems];
    }

}
