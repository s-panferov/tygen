import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

let fse = require('fs-extra');

export function _compile(
    fileNames: string[],
    options: ts.CompilerOptions
): [ts.LanguageService, ts.Program] {
    // Create the language service host to allow the LS to communicate with the host
    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => fileNames,
        getScriptVersion: (fileName) => '1',
        getScriptSnapshot: (fileName) => {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    };

    // Create the language service files
    const service = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    let program = service.getProgram();
    let allDiagnostics = ts.getPreEmitDiagnostics(program);

    allDiagnostics.forEach(diagnostic => {
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}):\n    ${message}`);
        } else {
            console.error(`${ message }`);
        }
    });

    if (allDiagnostics.length > 0) {
        throw new Error('Refuse to generate documentation due to compilation errors.');
    }

    return [service, program];
}

import { Context, Module } from '../doc/index';

export function generateFiles(
    fileNames: string[],
    mainPackage: string,
    opts?: ts.CompilerOptions
): Context {
    let ctx = new Context(mainPackage);
    let [service, program] = _compile(fileNames, Object.assign({}, opts, {
        target: ts.ScriptTarget.Latest,
        allowJs: true,
        noEmit: true,
    }));

    ctx.setService(service);
    ctx.setProgram(program);

    program.getSourceFiles().forEach(sourceFile => {
        ctx.addModule(sourceFile.fileName, sourceFile);
    });

    return ctx;
}

export function generateModule(fileName: string, mainPackage: string): Module {
    return generateFiles([ fileName ], mainPackage).getModule(fileName);
}

function buildEnumMap(tsImpl: typeof ts) {
    let typescriptEnumMap = {
        target: {
            'es3': tsImpl.ScriptTarget.ES3,
            'es5': tsImpl.ScriptTarget.ES5,
            'es6': tsImpl.ScriptTarget.ES6,
            'es2015': tsImpl.ScriptTarget.ES2015,
            'latest': tsImpl.ScriptTarget.Latest
        },
        module: {
            'none': tsImpl.ModuleKind.None,
            'commonjs': tsImpl.ModuleKind.CommonJS,
            'amd': tsImpl.ModuleKind.AMD,
            'umd': tsImpl.ModuleKind.UMD,
            'system': tsImpl.ModuleKind.System,
            'es6': tsImpl.ModuleKind.ES6,
            'es2015': tsImpl.ModuleKind.ES2015,
        },
        moduleResolution: {
            'node': tsImpl.ModuleResolutionKind.NodeJs,
            'classic': tsImpl.ModuleResolutionKind.Classic
        },
        jsx: {
            'preserve': tsImpl.JsxEmit.Preserve,
            'react': tsImpl.JsxEmit.React
        },
        newLine: {
            'CRLF': tsImpl.NewLineKind.CarriageReturnLineFeed,
            'LF': tsImpl.NewLineKind.LineFeed
        }
    };

    return typescriptEnumMap;
}

export function rawToTsCompilerOptions(jsonOptions, projectDir, tsImpl: typeof ts) {
    let typescriptEnumMap = buildEnumMap(tsImpl);
    let compilerOptions: any = {};
    for (let key in jsonOptions) {
        if (typescriptEnumMap[key]) {
            compilerOptions[key] = typescriptEnumMap[key][jsonOptions[key].toLowerCase()];
        }
        else {
            compilerOptions[key] = jsonOptions[key];
        }
    }
    if (compilerOptions.outDir !== undefined) {
        compilerOptions.outDir = path.resolve(projectDir, compilerOptions.outDir);
    }
    if (compilerOptions.rootDir !== undefined) {
        compilerOptions.rootDir = path.resolve(projectDir, compilerOptions.rootDir);
    }
    if (compilerOptions.out !== undefined) {
        compilerOptions.out = path.resolve(projectDir, compilerOptions.out);
    }
    if (compilerOptions.outFile !== undefined) {
        compilerOptions.out = path.resolve(projectDir, compilerOptions.outFile);
    }
    return compilerOptions;
}

export function copyUI(dir: string, libPath?: string) {
    fse.copySync(path.join(libPath, 'assets'), path.join(dir, 'assets'));
    fse.copySync(path.join(libPath, 'index.html'), path.join(dir, 'index.html'));
}
