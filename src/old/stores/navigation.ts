import { Flux } from '../flux';
import { Action, ActionType, Navigate } from '../actions';
import { NavigationR } from '../state-i';

export function navigation(state: NavigationR, action: Action, flux: Flux): NavigationR {
    switch (action.actionType) {
        case ActionType.Navigate: return onNavigate(state, action as any, flux);
    }
}

function onNavigate(state: NavigationR, action: Navigate, flux: Flux): NavigationR {
    return action.nav
}
