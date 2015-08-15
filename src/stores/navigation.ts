import { Flux } from '../flux';
import { Action, ActionType, Navigate } from '../actions';
import { NavigationRecord } from '../state-i';

export function navigation(state: NavigationRecord, action: Action, flux: Flux): NavigationRecord {
    switch (action.actionType) {
        case ActionType.Navigate: return onNavigate(state, action as any, flux);
    }
}


function onNavigate(state: NavigationRecord, action: Navigate, flux: Flux): NavigationRecord {
    return action.nav
}
