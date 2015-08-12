/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
/// <reference path="../typings/tsd.d.ts" />

declare module "bem-cn" {
    var block: any;
    export = block
}

declare module "material-ui" {
    var block: any;
    export = block
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
