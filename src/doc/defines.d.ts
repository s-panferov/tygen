/// <reference path="../../node_modules/typescript/lib/typescript.d.ts"/>
/// <reference path="../../node_modules/typescript/lib/typescriptServices.d.ts"/>
/// <reference path="../../typings/tsd.d.ts" />

declare module 'node-uuid' {
    export function v1(): string;
    export function v4(): string;
}

/**
 * Type declarations for Webpack runtime.
 */

interface WebpackRequireEnsureCallback {
    (req: WebpackRequire): void;
}

interface WebpackRequire {
    (id: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure(ids: string[], callback: WebpackRequireEnsureCallback, chunkName?: string): void;
}

declare var require: WebpackRequire;

declare let DEBUG: boolean;

declare interface Dictionary<T> {
    [key: string]: T;
}
