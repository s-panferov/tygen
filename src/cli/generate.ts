import * as tsconfig from 'tsconfig';
import * as ts from 'typescript';
import * as path from 'path';

import { DocWriter } from '../doc/writer';
import * as helpers from '../doc/helpers';

interface GenerateCommand {
    sourceDir: string;
    mainPackage: string;
    outDir: string;
    ui?: string;
    deepForeign?: boolean;
    withoutSearch?: boolean;
}

export default function generate(argv: GenerateCommand) {
    let tsconfigPath = tsconfig.resolveSync(argv.sourceDir);

    if (!tsconfigPath) {
        throw new Error('Cannot resolve tsconfig.json in sourceDir');
    }

    let { files, compilerOptions } = tsconfig.loadSync(tsconfigPath);

    let tsCompilerOptions = helpers.rawToTsCompilerOptions(compilerOptions, process.cwd(), ts);
    let ctx = helpers.generateFiles(files, argv.mainPackage, tsCompilerOptions);

    ctx.generateForeignModules(argv.deepForeign);

    let writer = new DocWriter(ctx);
    writer.ensureDir(argv.outDir);
    writer.writeModules(path.join(argv.outDir, 'generated'), !argv.withoutSearch)
        .then(() => {
            helpers.copyUI(argv.outDir, argv.ui);
            process.exit(0);
        })
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
};

export const CLI = {
    config: {
      alias: '-c',
      default: 'docscript.json',
      describe: 'Path to your .docscript.json file',
    },
    sourceDir: {
      alias: '-d',
      default: '.',
      describe: 'Source directory with your tsconfig.json file',
    },
    mainPackage: {
      alias: '-p',
      describe: 'Main that will be shown in docscript',
    },
    outDir: {
      alias: '-o',
      default: 'doc',
      describe: 'Directory to write output',
    },
    ui: {
      describe: 'Package where compiled docscript UI is located',
    },
    deepForeign: {
      alias: '-f',
      describe: 'Keep all deep links consistent',
    },
    withoutSearch: {
      alias: '-n',
      describe: 'Omit search index generation',
    },
};
