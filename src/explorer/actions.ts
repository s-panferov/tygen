import { Action, Dispatch, GetState } from './redux';
import { Route } from './state';
import { ModuleInfo } from '../doc/index';
import { Item } from '../doc/items';
import { debounce } from '../lib/utils';

export enum ActionType {
    Navigate = 'Navigate' as any,
    LoadModule = 'LoadModule' as any,
    LoadItem = 'LoadItem' as any,
    ToggleSearch = 'ToggleSearch' as any,
    ChangeSearchQuery = 'ChangeSearchQuery' as any,
    SearchIndexReady = 'SearchIndexReady' as any,
    Search = 'Search' as any
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
        dispatch({
            type: ActionType.Navigate,
            payload: {
                route
            }
        } as Action<Navigate, void>);

        let { activity, service, items, modules } = getState();
        let moduleMetaName = service.getModuleMetaName(route);

        let promise = moduleMetaName.caseOf({
            just: (moduleMetaName) => {
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
                        let promise = fetch(`/doc/generated/${moduleMetaName.replace('.json', '')}/${itemId}.json`)
                            .then(res => res.json())
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
                    let promise = fetch(`/doc/generated/${moduleMetaName}`)
                        .then(res => res.json())
                        .then((moduleInfo: ModuleInfo) => {
                            dispatch({
                                type: ActionType.LoadModule,
                                payload: {
                                    moduleInfo
                                }
                            } as Action<LoadModule, void>);
                        });
                    promises.push(promise);
                }

                return Promise.all(promises) as Promise<any>;
            },
            nothing: () => Promise.resolve()
        });

        promise = promise.catch(e => { console.error(e.toString()); throw e; });
        activity.watch(promise);
    };
}
