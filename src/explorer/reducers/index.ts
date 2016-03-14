import { State, Action, ActionType } from '../redux';
import {
    Navigate,
    ChangeSearchQuery,
    Search,
    isError,
    InitSearchIndex,
    ChangeDisplaySettings
} from '../actions';

export default function root(state: State, action: Action<any, any>): State {
    switch (action.type) {
        case ActionType.Navigate:
            return navigate(state, action as any);
        case ActionType.ToggleSearch:
            return toggleSearch(state, action as any);
        case ActionType.ChangeSearchQuery:
            return changeSearchQuery(state, action as any);
        case ActionType.InitSearchIndex:
            return initSearchIndex(state, action as any);
        case ActionType.Search:
            return search(state, action as any);
        case ActionType.ChangeDisplaySettings:
            return changeDisplaySettings(state, action as any);
        default:
            return state;
    }
}

function navigate(state: State, { payload }: Action<Navigate, void>): State {
    if (!isError(payload)) {
        let { route, ready, moduleInfo, item } = payload;
        if (!ready) {
            return Object.assign({}, state,
                {
                    route
                }
            );
        } else {
            if (!route.id && item) {
                // assign id for url-based routes
                route = Object.assign({}, route, {
                    id: moduleInfo.semanticIdMap[route.semanticId]
                });
            }
            return Object.assign({}, state,
                {
                    route,
                    module: moduleInfo,
                    item
                }
            );
        }
    } else {
        return state;
    }
}

function changeDisplaySettings(state: State, { payload }: Action<ChangeDisplaySettings, void>): State {
    if (!isError(payload)) {
        return Object.assign({}, state,
            {
                displaySettings: Object.assign({}, state.displaySettings, payload)
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

function initSearchIndex(state: State, { payload }: Action<InitSearchIndex, void>): State {
    if (!isError(payload) && payload.ready) {
        return Object.assign({}, state,
            {
                searchIndexReady: true
            }
        );
    } else {
        return state;
    }
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
                    searchInProgress: false,
                    searchResults
                }
            );
        } else {
            return Object.assign({}, state,
                {
                    searchInProgress: true,
                }
            );
        }
    } else {
        return state;
    }

}
