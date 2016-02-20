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

        let { service, items, modules } = getState();
        let moduleMetaName = service.getModuleMetaName(route);

        moduleMetaName.caseOf<void>({
            just: (moduleMetaName) => {
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
                        fetch(`/doc/${moduleMetaName.replace('.json', '')}/${itemId}.json`)
                            .then(res => res.json())
                            .then((item: Item) => {
                                dispatch({
                                    type: ActionType.LoadItem,
                                    payload: {
                                        item
                                    }
                                } as Action<LoadItem, void>);
                            });
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
                    fetch(`/doc/${moduleMetaName}`)
                        .then(res => res.json())
                        .then((moduleInfo: ModuleInfo) => {
                            dispatch({
                                type: ActionType.LoadModule,
                                payload: {
                                    moduleInfo
                                }
                            } as Action<LoadModule, void>);
                        });
                }
            },
            nothing: () => Promise.resolve()
        });
    };
}
