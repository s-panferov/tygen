import * as typescript from 'typescript';

import { Context, Module } from './index';

export function _compile(fileNames: string[], options: typescript.CompilerOptions): typescript.Program {
    let program = typescript.createProgram(fileNames, options);
    let allDiagnostics = typescript.getPreEmitDiagnostics(program);

    allDiagnostics.forEach(diagnostic => {
        let message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}):\n    ${message}`);
        } else {
            console.error(`${ message }`);
        }
    });

    return program;
}

export function generateFiles(fileNames: string[]): Context {
    let ctx = new Context();
    let program = _compile(fileNames, {
        target: typescript.ScriptTarget.Latest
    });

    ctx.setProgram(program);

    fileNames.forEach(fileName => {
        ctx.addModule(fileName, program.getSourceFile(fileName));
    });

    return ctx;
}

export function generateModule(fileName: string): Module {
    return generateFiles([ fileName ]).getModule(fileName);
}
