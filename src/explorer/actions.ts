import { Action, Dispatch, GetState } from './redux';
import { Route } from './state';
import { ModuleInfo } from '../doc/index';
import { Item } from '../doc/items';
import { debounce } from '../lib/utils';
import { Settings, DisplaySettings } from './settings';

export enum ActionType {
    Navigate = 'Navigate' as any,
    ChangeDisplaySettings = 'ChangeDisplaySettings' as any,
    ToggleSearch = 'ToggleSearch' as any,
    ChangeSearchQuery = 'ChangeSearchQuery' as any,
    InitSearchIndex = 'InitSearchIndex' as any,
    Search = 'Search' as any
}

// helper
export function isError<T>(payload: Error | T): payload is Error {
    return payload instanceof Error;
}

export interface InitSearchIndex {
    settings?: Settings;
    ready?: boolean;
}
export function initSearchIndex(settings: Settings): Action<InitSearchIndex, void> {
    return {
        type: ActionType.InitSearchIndex,
        payload: {
            settings
        }
    };
}

export function toggleSearch() {
    return {
        type: ActionType.ToggleSearch,
        payload: null
    };
}

export interface Search {
    query: string;
    searchResults?: any[];
}
export function search(query: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        let initAction = {
            type: ActionType.Search,
            payload: {
                query
            }
        } as Action<Search, void>;
        dispatch(initAction);
        getState().searchIndex.postMessage(initAction);
    };
}

export interface ChangeDisplaySettings extends DisplaySettings {
}
export function changeDisplaySettings(newSettings: DisplaySettings) {
    return {
        type: ActionType.ChangeDisplaySettings,
        payload: newSettings
    } as Action<ChangeDisplaySettings, void>;
}

export var debouncedSearch = debounce((dispatch: Dispatch, query) => {
    dispatch(search(query));
}, 300);

export interface ChangeSearchQuery {
    query: string;
}
export function changeSearchQuery(query: string) {
    return (dispatch: Dispatch, getState: GetState) => {
        dispatch({
            type: ActionType.ChangeSearchQuery,
            payload: {
                query
            }
        } as Action<ChangeSearchQuery, void>);

        if (!getState().searchInProgress) {
            debouncedSearch(dispatch, query);
        }
    };
}

export interface Navigate {
    route?: Route;
    ready: boolean;
    moduleInfo?: ModuleInfo;
    item?: Item;
}
export function navigate(route: Route) {
    if (route.pkg.indexOf('/') !== -1) {
        let parts = route.pkg.split('/');
        let pkg = parts[0];
        let path = '/' + parts.slice(1).join('/') + route.path;

        route = Object.assign({}, route, { pkg, path });
        console.log('normalized route', route);
    }

    return (dispatch: Dispatch, getState: GetState) => {
        dispatch({
            type: ActionType.Navigate,
            payload: {
                route,
                ready: false
            }
        } as Action<Navigate, void>);

        let { activity, service } = getState();
        let promise = service.ensureRoute(route).then(({ item, module }) => {
            dispatch({
                type: ActionType.Navigate,
                payload: {
                    route,
                    ready: true,
                    moduleInfo: module as any,
                    item,
                }
            } as Action<Navigate, void>);
        });

        activity.watch(promise);
    };
}
