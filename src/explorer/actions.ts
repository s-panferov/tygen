import { Action, Dispatch, GetState } from './redux';
import { Route } from './state';
import { ModuleInfo } from '../doc/index';
import { Item } from '../doc/items';

export enum ActionType {
    Navigate = 'Navigate' as any,
    LoadModule = 'LoadModule' as any,
    LoadItem = 'LoadItem' as any,
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
                    // load current selected item
                    let itemId = Object.keys(service.registry.idMap).find(id => {
                        return id == route.id || route.nesting.indexOf(id) !== -1;
                    });

                    if (items[itemId]) {
                        dispatch({
                            type: ActionType.LoadItem,
                            payload: {
                                // item from cache
                                item: items[itemId]
                            }
                        } as Action<LoadItem, void>);
                    } else {
                        let promise = fetch(`/doc/${moduleMetaName.replace('.json', '')}/${itemId}.json`)
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
                    let promise = fetch(`/doc/${moduleMetaName}`)
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

        activity.watch(promise);
    };
}
