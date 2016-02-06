/// <reference path="./defines.d.ts" />

require('source-map-support').install();

import { extractPackage, getFileInfo } from './utils';
import { processSourceFile } from './gen';
import { Item } from './items';
import * as uuid from 'node-uuid';

export { DocWriter } from './writer';

import {
    TypeChecker,
    Program,
    SourceFile
} from 'typescript';

import * as typescript from 'typescript';

export interface Package {
    info: PackageInfo;
    path: string;
}

export interface PackageInfo {
    name: string;
    version: string;
    description: string;
}

export interface FileInfo {
    relativeToPackage: string;
    withPackage: string;
    metaName: string;
}

export interface ModuleInfo {
    text: string;
    pkg: Package;
    fileInfo: FileInfo;
}

export interface DocRegistry {
    mainPackage: string;
    files: Dictionary<ModuleInfo>;
}

/**
 * Contains all documents
 */
export class Context {
    modules: Dictionary<Module> = {};
    ts = typescript;
    checker: TypeChecker = null;
    program: Program;

    currentModule: Module;
    ids: WeakMap<any, string>;

    constructor() {
        this.ids = new WeakMap();
    }

    id(object: any): string {
        if (!this.ids.has(object)) {
            this.ids.set(object, uuid.v1());
        }

        return this.ids.get(object);
    }

    setProgram(program: Program) {
        this.program = program;
        this.checker = this.program.getTypeChecker();
    }

    addModule(fileName, sourceFile: SourceFile) {
        let module = this.generateModule(fileName, sourceFile);
        this.modules[fileName] = module;
    }

    getModule(fileName): Module {
        return this.modules[fileName];
    }

    private generateModule(fileName: string, source: SourceFile): Module {
        let pkg = extractPackage(fileName);
        let fileInfo = getFileInfo(fileName, pkg);
        let doc = new Module(source, pkg, fileInfo);

        this.currentModule = doc;
        processSourceFile(source, this);
        this.currentModule = null;

        return doc;
    }
}

export class Module implements ModuleInfo {
    text: string;
    pkg: Package;
    fileInfo: FileInfo;

    items: Item[] = [];

    constructor(sourceFile: SourceFile, pkg: Package, fileInfo: FileInfo) {
        this.text = sourceFile.text;
        this.pkg = pkg;
        this.fileInfo = fileInfo;
    }

    toJSON() {
        let { text, pkg, fileInfo, items } = this;
        return { pkg, fileInfo, text, items };
    }
}
