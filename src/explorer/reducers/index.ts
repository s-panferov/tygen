import { State, Action, ActionType } from '../redux';
import { Navigate, LoadItem, LoadModule } from '../actions';

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
        default:
            return state;
    }
}

function navigate(state: State, { payload }: Action<Navigate, void>): State {
    if (!isError(payload)) {
        let { route } = payload;
        return Object.assign({}, state,
            {
                route: state.service.getFullRoute(route)
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
                items: Object.assign(state.items, {
                    [ moduleInfo.fileInfo.metaName ]: moduleInfo
                }),
                module: moduleInfo
            }
        );
    } else {
        return state;
    }
}
