/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
/// <reference path="./typings/react-dom.d.ts"/>
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

declare let DEBUG: boolean;

declare module __React {
    interface CSSProperties {
        width?: string;
        display?: string;
        position?: string;
        padding?: string;
        margin?: string;
        paddingBottom?: string;
        paddingTop?: string;
        paddingLeft?: string;
        paddingRight?: string;
        marginBottom?: string;
        marginTop?: string;
        marginLeft?: string;
        marginRight?: string;
        listStyle?: string;
        color?: string;
        alignSelf?: string;
        backgroundColor?: string;
        flexDirection?: string;
        cursor?: string;
    }

    interface JsxClass<P, S> extends Component<P, S> {
        render(): ReactElement<P>
    }

    interface ReactCtor<P, S> {
        new(props: P, context: any): JsxClass<P, S>;
    }

    interface CommonAttributes extends DOMAttributes {
        ref?: string | ((component: HTMLComponent) => void);
        className?: string | { toString: () => string };
        style?: CSSProperties;
        tabIndex?: number;
        id?: string;
    }
}
