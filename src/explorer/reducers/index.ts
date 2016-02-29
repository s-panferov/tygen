import { State, Action, ActionType } from '../redux';
import {
    Navigate,
    LoadItem,
    LoadModule,
    ChangeSearchQuery,
    Search
} from '../actions';

// helper
function isError<T>(payload: Error | T): payload is Error {
    return payload instanceof Error;
}

export default function root(state: State, action: Action<any, any>): State {
    switch (action.type) {
        case ActionType.Navigate:
            return navigate(state, action as any);
        case ActionType.LoadItem:
            return loadItem(state, action as any);
        case ActionType.LoadModule:
            return loadModule(state, action as any);
        case ActionType.ToggleSearch:
            return toggleSearch(state, action as any);
        case ActionType.ChangeSearchQuery:
            return changeSearchQuery(state, action as any);
        case ActionType.SearchIndexReady:
            return searchIndexReady(state, action as any);
        case ActionType.Search:
            return search(state, action as any);
        default:
            return state;
    }
}

function navigate(state: State, { payload }: Action<Navigate, void>): State {
    if (!isError(payload)) {
        let { route } = payload;
        return Object.assign({}, state,
            {
                route: state.service.getFullRoute(route),
                item: (state.item && state.item.id == route.mainId) ? state.item : null,
                module: (route.pkg == state.route.pkg && route.path == state.route.path)
                    ? state.module
                    : null
            }
        );
    } else {
        return state;
    }
}

function loadItem(state: State, { payload }: Action<LoadItem, void>): State {
    if (!isError(payload)) {
        let { item } = payload;
        return Object.assign({}, state,
            {
                items: Object.assign(state.items, {
                    [ item.id ]: item
                }),
                item
            }
        );
    } else {
        return state;
    }
}

function loadModule(state: State, { payload }: Action<LoadModule, void>): State {
    if (!isError(payload)) {
        let { moduleInfo } = payload;
        return Object.assign({}, state,
            {
                modules: Object.assign(state.modules, {
                    [ moduleInfo.fileInfo.metaName ]: moduleInfo
                }),
                module: moduleInfo
            }
        );
    } else {
        return state;
    }
}

function toggleSearch(state: State, action: Action<any, void>): State {
    return Object.assign({}, state,
        {
            searchActive: !state.searchActive
        }
    );
}

function searchIndexReady(state: State, action: Action<any, void>): State {
    return Object.assign({}, state,
        {
            searchIndexReady: true
        }
    );
}

function changeSearchQuery(state: State, { payload }: Action<ChangeSearchQuery, void>): State {
    if (!isError(payload)) {
        return Object.assign({}, state,
            {
                searchQuery: payload.query
            }
        );
    } else {
        return state;
    }

}

function search(state: State, { payload }: Action<Search, void>): State {
    if (!isError(payload)) {
        let { searchResults } = payload;
        if (searchResults) {
            return Object.assign({}, state,
                {
                    searchResults
                }
            );
        } else {
            return state;
        }
    } else {
        return state;
    }

}
