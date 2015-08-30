/// <reference path="../defines.d.ts" />

require('source-map-support').install();

import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { PackageDef, DocPkgInfo, Doc, DocFileDef } from '../state';
import { processSourceFile } from './gen';
import { DocItem } from './items';

import {
    TypeChecker,
    Program,
    SourceFile
} from 'typescript';

import * as typescript from 'typescript';

let fse = require('fs-extra');
let closest = require('closest-package');

export class DocContext {
    docs: Dictionary<DocRuntime> = {};
    ts = typescript;
    checker: TypeChecker = null;
    program: Program;

    doc: DocRuntime;

    setProgram(program: Program) {
        this.program = program;
        this.checker = this.program.getTypeChecker();
    }

    addDoc(fileName, sourceFile: SourceFile) {
        let doc = this.generateDoc(fileName, sourceFile);
        this.docs[fileName] = doc;
    }

    generateDoc(fileName: string, source: SourceFile): DocRuntime {
        let pkg = extractPackage(fileName);
        let docFilePath = getDocFilePath(fileName, pkg);
        let doc = new DocRuntime(source, pkg, docFilePath);

        this.doc = doc;
        processSourceFile(source, this);
        this.doc = null;

        return doc;
    }

    getDoc(fileName): DocRuntime {
        return this.docs[fileName];
    }
}

export class DocRuntime implements Doc {
    text: string;
    pkg: DocPkgInfo;
    fileInfo: DocFileDef;
    items: DocItem[] = [];

    constructor(sourceFile: SourceFile, pkg: PackageDef, fileInfo: DocFileDef) {
        this.text = sourceFile.text;
        this.pkg = {
            name: pkg.info.name,
            version: pkg.info.version,
            description: pkg.info.description,
        };

        this.fileInfo = fileInfo;
    }

    toJSON() {
        let { text, pkg, fileInfo } = this;
        return { pkg, fileInfo, text };
    }
}

export class DocWriter {
    context: DocContext;

    constructor(context: DocContext) {
        this.context = context;
    }

    writeDocs(dir: string) {
        fse.ensureDirSync(dir);
        _.forEach(this.context.docs, (doc) => {
            let metaPath = path.join(dir, doc.fileInfo.metaName);
            fs.writeFileSync(metaPath, JSON.stringify(doc, null, 4));
        });

        this.writeRegistryModule(dir)
    }

    generateRegistryModule(dir: string): string {
        let buf = `
module.exports = {\n
    mainPackage: '${extractPackage(dir).info.name}',
    files: {
        `;

        _.forEach(this.context.docs, (doc) => {
            buf += `    '${doc.fileInfo.metaName}': require('./${ doc.fileInfo.metaName }'),\n`
        });

        buf += '}}';

        return buf;
    }

    writeRegistryModule(dir: string) {
        let registryModule = this.generateRegistryModule(dir);
        fs.writeFileSync('./docs/registry.js', registryModule);
    }
}

export function extractPackage(fileName: string): PackageDef {
    let pkgJson = closest.sync(path.dirname(fileName));
    return {
        path: path.dirname(pkgJson),
        info: JSON.parse(fs.readFileSync(pkgJson).toString())
    }
}

export function getDocFilePath(fileName: string, pkg: PackageDef): DocFileDef {
    let relativeToOrigin = path.relative(process.cwd(), fileName);

    let shasum = crypto.createHash('sha1');
    shasum.update(relativeToOrigin);

    let metaName = shasum.digest('hex') + '.json';
    let relativeToPackage = path.relative(pkg.path, fileName);

    if (!/^(\.|\/)/.test(relativeToPackage)) {
        relativeToPackage = '/' + relativeToPackage
    }

    let withPackage = pkg.info.name + '://' + relativeToPackage;

    return {
        metaName,
        relativeToPackage,
        withPackage
    }
}

export function _compile(fileNames: string[], options: typescript.CompilerOptions): typescript.Program {
    var program = typescript.createProgram(fileNames, options);
    var allDiagnostics = typescript.getPreEmitDiagnostics(program);

    allDiagnostics.forEach(diagnostic => {
        console.log(diagnostic)
        if (diagnostic.file) {
            var { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        }
        var message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file && diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });

    return program;
}

export function generateFiles(fileNames: string[]): DocContext {
    let ctx = new DocContext();
    let program = _compile(fileNames, { target: typescript.ScriptTarget.Latest });

    ctx.setProgram(program);

    fileNames.forEach(fileName => {
        ctx.addDoc(fileName, program.getSourceFile(fileName));
    })

    return ctx;
}

export function generateFile(fileName: string): DocRuntime {
    return generateFiles([ fileName ]).getDoc(fileName);
}
