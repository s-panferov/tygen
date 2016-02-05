declare module 'history' {
    export interface ActionsInterface {
        PUSH: string;
        POP: string;
        REPLACE: string;
    }

    export const Actions: ActionsInterface;

    export interface History {
        listen(cb: (location: any) => void): { unlisten(): void };
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
