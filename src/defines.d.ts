/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
/// <reference path="../typings/tsd.d.ts" />

declare module "bem-cn" {
    interface ClassName {
        (name: string, ...mod: any[]): any
    }

    var block: ClassName;
    export default block;
}

declare module "memory-fs" {
    interface MemoryFsStat {
        isFile: () => boolean,
        isDirectory: () => boolean,
        isSymbolicLink: () => boolean,
    }

    class MemoryFileSystem {
        statSync(path: string): MemoryFsStat;
        readdirSync(path: string): string[];
        mkdirpSync(path: string);
        mkdirSync(path: string);
        writeFileSync(path: string, content: string);
    }

    export default MemoryFileSystem
}

/**
 * Type declarations for Webpack runtime.
 */

interface WebpackRequireEnsureCallback {
    (req: WebpackRequire): void
}

interface WebpackRequire {
    (id: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure(ids: string[], callback: WebpackRequireEnsureCallback, chunkName?: string): void;
}

declare var require: WebpackRequire;
