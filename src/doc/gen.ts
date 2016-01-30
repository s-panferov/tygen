import {
    SourceFile,
} from 'typescript';

import * as typescript from 'typescript';

import { Context } from './index';

export function processSourceFile(source: SourceFile, ctx: Context) {
    source.statements.forEach(statement => {
        console.log(statement);
    });
}
