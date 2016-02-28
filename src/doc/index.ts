require('source-map-support').install();

import { extractPackage, getFileInfo } from './utils';
import { processSourceFile } from './gen';
import { Item } from './items';

import {
    TypeChecker,
    Program,
    SourceFile,
    Symbol,
    Node
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

export enum ModuleKind {
    TypeScript = 'typescript' as any
}

export interface ModuleInfo {
    kind: ModuleKind;
    text: string;
    pkgName: string;
    fileInfo: FileInfo;
    items: [string, string, string][];
}

export interface IdMap {
    [key: string]: [string, string, string, string[]];
}

export interface SemanticIdMap {
    [pkg: string]: {[path: string]: {[semanticId: string]: string}};
}

export interface DocRegistry {
    mainPackage: string;
    files: Dictionary<string>;
    idMap: IdMap;
    semanticIdMap: SemanticIdMap;
    packages: Dictionary<PackageInfo>;
}

function isNode(node: Symbol | Node): node is Node {
    return !!(node as any).kind;
}

/**
 * Contains all documents
 */
export class Context {
    modules: Dictionary<Module> = {};
    ts = typescript;
    checker: TypeChecker = null;
    program: Program;

    mainPackage: string;
    packages: Dictionary<PackageInfo> = {};

    currentModule: Module;
    currentStack: Symbol[];
    currentId: number;

    ids: WeakMap<any, string>;
    _visited: WeakMap<any, boolean>;

    includeAllowed: boolean = true;
    foreignItems: { [itemId: string]: boolean } = {};
    foreignModules: { [fileName: string]: [SourceFile, Package] } = {};

    constructor(mainPackage: string) {
        this.ids = new WeakMap();
        this._visited = new WeakMap();
        this.currentStack = [];
        this.currentId = 1;
        this.mainPackage = mainPackage;
    }

    inCurrentContext(symbol: Symbol): boolean {
        return this.currentStack.indexOf(symbol) !== -1;
    }

    include(id: string) {
        if (this.includeAllowed) {
            this.foreignItems[id] = true;
        }
    }

    included(id: string): boolean {
        return !!this.foreignItems[id];
    }

    dive<T>(level: Symbol | Node, func: () => T): T {
        let symbol: Symbol;
        if (isNode(level)) {
            symbol = this.checker.getTypeAtLocation(level).getSymbol();
        } else {
            symbol = level;
        }

        if (!symbol) {
            console.error(level);
            throw new Error(`Can't find the symbol`);
        }

        symbol.declarations.forEach(decl => {
            this.visit(decl);
        });

        this.currentStack.push(symbol);
        let result = func();
        this.currentStack.pop();

        return result;
    }

    visit(obj: any) {
        this._visited.set(obj, true);
    }

    isVisited(obj: any): boolean {
        return this._visited.get(obj);
    }

    semanticId(level?: string): string {
        let currentStack = this.currentStack.map(sym => sym.name);
        if (level) {
            currentStack = currentStack.concat(level);
        }
        return currentStack.join('.');
    }

    id(object?: any): string {
        if (object) {
            if (!this.ids.has(object)) {
                this.ids.set(object, (this.currentId++).toString());
                // this.ids.set(object, uuid.v1());
            }

            return this.ids.get(object);
        } else {
            return (this.currentId++).toString();
        }
    }

    setProgram(program: Program) {
        this.program = program;
        this.checker = this.program.getTypeChecker();
    }

    addModule(fileName, sourceFile: SourceFile) {
        let pkg = extractPackage(fileName);
        let name = pkg.info.name;
        this.packages[name] = pkg.info;

        if (name === this.mainPackage) {
            let module = this.generateModule(fileName, sourceFile, pkg);
            this.modules[fileName] = module;
        } else {
            this.foreignModules[fileName] = [sourceFile, pkg];
        }
    }

    generateForeignModules() {
        this.includeAllowed = false;
        Object.keys(this.foreignModules).forEach(fileName => {
            let [sourceFile, pkg] = this.foreignModules[fileName];
            let module = this.generateModule(fileName, sourceFile, pkg, true);
            this.modules[fileName] = module;
        });
    }

    getModule(fileName): Module {
        return this.modules[fileName];
    }

    private generateModule(fileName: string, source: SourceFile, pkg: Package, foreign = false): Module {
        let fileInfo = getFileInfo(fileName, pkg);
        let doc = new Module(source, pkg.info.name, fileInfo);

        this.currentModule = doc;
        processSourceFile(source as any, this, foreign);
        this.currentModule = null;

        return doc;
    }
}

export class Module {
    kind = ModuleKind.TypeScript;
    text: string;
    pkgName: string;
    fileInfo: FileInfo;

    items: Item[] = [];
    itemsIndex: { [id: string]: Item } = {};

    constructor(sourceFile: SourceFile, pkgName: string, fileInfo: FileInfo) {
        this.text = sourceFile.text;
        this.pkgName = pkgName;
        this.fileInfo = fileInfo;
    }

    toJSON() {
        let { text, pkgName, fileInfo, itemsIndex, kind } = this;
        let shortItems = Object.keys(itemsIndex).map(itemId => {
            let item = itemsIndex[itemId];
            return [itemId, item.itemType, item.name];
        });
        return { kind, pkgName, fileInfo, items: shortItems, text };
    }
}
