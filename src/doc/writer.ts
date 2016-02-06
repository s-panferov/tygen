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
        fse.ensureDirSync(dir);
        _.forEach(this.context.modules, (module) => {
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

        _.forEach(this.context.modules, (module) => {
            buf += `    '${module.fileInfo.metaName}': require('./${ module.fileInfo.metaName }'),\n`;
        });

        buf += '}}';

        return buf;
    }

    writeRegistryModule(dir: string) {
        let registryModule = this.generateRegistryModule(dir);
        fs.writeFileSync(path.join(dir, 'registry.js'), registryModule);
    }
}
