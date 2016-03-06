import { Action, Dispatch, GetState } from './redux';
import { Route } from './state';
import { inflateJson } from './inflate';
import { ModuleInfo } from '../doc/index';
import { Item } from '../doc/items';
import { debounce } from '../lib/utils';
import { Settings, DisplaySettings } from './settings';

export enum ActionType {
    Navigate = 'Navigate' as any,
    ChangeDisplaySettings = 'ChangeDisplaySettings' as any,
    LoadModule = 'LoadModule' as any,
    LoadItem = 'LoadItem' as any,
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
    route: Route;
}
export interface LoadModule {
    moduleInfo: ModuleInfo;
}
export interface LoadItem {
    item: Item;
}
export function navigate(route: Route) {
    return (dispatch: Dispatch, getState: GetState) => {
        let { settings } = getState();
        dispatch({
            type: ActionType.Navigate,
            payload: {
                route
            }
        } as Action<Navigate, void>);

        let { activity, service, items, modules } = getState();
        let moduleMetaName = service.getModuleMetaName(route);

        let promise: Promise<any>;
        if (!moduleMetaName) {
            promise = Promise.resolve();
        } else {
            let promises: Promise<any>[] = [];
            if (route.id) {
                let itemId = route.mainId || route.id;

                if (items[itemId]) {
                    dispatch({
                        type: ActionType.LoadItem,
                        payload: {
                            // item from cache
                            item: items[itemId]
                        }
                    } as Action<LoadItem, void>);
                } else {
                    let promise = fetch(`${settings.docRoot}/${moduleMetaName.replace('.json', '')}/${itemId}.json.gz`)
                        .then(res => inflateJson(res))
                        .then((item: Item) => {
                            dispatch({
                                type: ActionType.LoadItem,
                                payload: {
                                    item
                                }
                            } as Action<LoadItem, void>);
                        });
                    promises.push(promise);
                }
            }

            if (modules[moduleMetaName]) {
                dispatch({
                    type: ActionType.LoadModule,
                    payload: {
                        moduleInfo: modules[moduleMetaName]
                    }
                } as Action<LoadModule, void>);
            } else {
                // load module meta info
                let promise = fetch(`${settings.docRoot}/${moduleMetaName}.gz`)
                    .then(res => inflateJson(res))
                    .then((moduleInfo) => {
                        dispatch({
                            type: ActionType.LoadModule,
                            payload: {
                                moduleInfo: moduleInfo as any
                            }
                        } as Action<LoadModule, void>);
                    });
                promises.push(promise);
            }

            promise = Promise.all(promises) as Promise<any>;
        }

        promise = promise.catch(e => { console.error(e.toString()); throw e; });
        activity.watch(promise);
    };
}
