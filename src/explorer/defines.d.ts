/// <reference path="./typings/react/react.d.ts"/>
/// <reference path="./typings/react/react-dom.d.ts"/>
/// <reference path="./typings/bem-cn.d.ts"/>
/// <reference path="./typings/history.d.ts"/>
/// <reference path="./typings/react-common.d.ts"/>
/// <reference path="./typings/react-custom-scrollbars.d.ts"/>
/// <reference path="./typings/redux.d.ts"/>
/// <reference path="./typings/react-redux.d.ts"/>
/// <reference path="./typings/redux-thunk.d.ts"/>

declare module 'memory-fs' {
    export interface MemoryFsStat {
        isFile: () => boolean;
        isDirectory: () => boolean;
        isSymbolicLink: () => boolean;
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

declare module 'material-ui/lib/toggle' {
    let Toggle: any;
    export default Toggle;
}

declare module 'material-ui/lib/text-field' {
    let TextField: any;
    export default TextField;
}
