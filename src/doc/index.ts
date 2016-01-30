/// <reference path="./defines.d.ts" />

require('source-map-support').install();

import { extractPackage, getFileInfo } from './utils';
import { processSourceFile } from './gen';
import { DocItem } from './items';

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

export interface ModulesIndex {
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

    items: DocItem[] = [];

    constructor(sourceFile: SourceFile, pkg: Package, fileInfo: FileInfo) {
        this.text = sourceFile.text;
        this.pkg = pkg;
        this.fileInfo = fileInfo;
    }

    toJSON() {
        let { text, pkg, fileInfo } = this;
        return { pkg, fileInfo, text };
    }
}
