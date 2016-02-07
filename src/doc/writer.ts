import * as path from 'path';
import * as fs from 'fs';
import { Context } from './index';
import { extractPackage } from './utils';

let fse = require('fs-extra');

export class DocWriter {
    context: Context;

    constructor(context: Context) {
        this.context = context;
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
        let buf = `
module.exports = {\n
    mainPackage: '${extractPackage(dir).info.name}',
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
