import { Context } from '../doc/index';
import { Program } from 'typescript';
import { DocWriter } from '../doc/writer';

module.exports = init;

interface Options {
    output: string;
    mainPackage: string;
}

function init(options: Options) {
    return new Plugin(options);
}

class Plugin {
    options: Options;

    constructor(options: Options) {
        this.options = options;
    }

    processProgram(program: Program) {
        let ctx = new Context(this.options.mainPackage);
        ctx.setProgram(program);

        let files = program.getSourceFiles();
        files.forEach(file => {
            // if (file.fileName.indexOf('.d.ts') === -1) {
                ctx.addModule(file.fileName, file);
            // }
        });

        ctx.generateForeignModules();

        let writer = new DocWriter(ctx);
        writer.writeModules(this.options.output);
    }
}
