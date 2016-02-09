declare module 'history' {
    export interface ActionsInterface {
        PUSH: string;
        POP: string;
        REPLACE: string;
    }

    export const Actions: ActionsInterface;

    export interface Location {
        /**
         * The pathname portion of the URL, without query string
         */
        pathname?: string;
        /**
         * The query string portion of the URL, including the ?
         */
        search?: string;
        /**
         * An object of data tied to this location
         */
        state?: string;
        /**
         * One of PUSH, REPLACE, or POP
         */
        action?: string;
        /**
         * A unique identifier for this location
         */
        key?: string;
    }

    export interface History {
        listen(cb: (location: Location) => void): { unlisten(): void };
        push(location: Location): void;
        pushState(state: any, location: string, query: any): void;
        replaceState(state: any, location: string): void;
        setState(state: any): void;
        go(n: number): void;
        goBack(): void;
        goForward(): void;
        createHref(href: string): any;
    }

    export function useQueries(foo: typeof createHistory): (params?: any) => History;
    export function createHistory(): History;
    export function createHashHistory(): History;
}

declare module 'history/lib/createBrowserHistory' {
    import * as history from 'history';
    export default function createHistory(): history.History;
}

declare module 'history/lib/createHashHistory' {
    import * as history from 'history';
    export default function createHistory(): history.History;
}

declare module 'history/lib/createMemoryHistory' {
    import * as history from 'history';
    export default function createHistory(): history.History;
}
