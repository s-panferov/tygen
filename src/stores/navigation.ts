import { Map } from 'immutable';

import { IState, IEnv } from '../index';
import { IAction, INavigate, ActionType } from '../actions';

export interface IRawNavState {
    pkg: string,
    path: string
}

export interface INavState extends IState {
    get(key: 'pkg'): string
    get(key: 'path'): string
    get(key: string): void
}

export function navigation(state: IState, action: IAction, env: IEnv) {
    if (state.isEmpty()) {
        return defaultNavigation(env)
    }

    switch (action.actionType) {
        case ActionType.Navigate: return onNavigate(state, <any>action, env);
    }
}

function defaultNavigation(env: IEnv) {
    return Map({
        pkg: env.service.getMainPackageName(),
        path: '/'
    })
}

function onNavigate(state: IState, action: INavigate, env: IEnv) {
    return state.update((_val) => {
        return Map<string, any>(<IRawNavState>{
            pkg: action.pkg,
            path: action.path
        })
    })
}