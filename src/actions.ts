import { NavigationRecord } from './state-i';

export enum ActionType {
    Navigate = <any>"NAVIGATE"
}

export interface Action {
    actionType?: ActionType
}

export interface Navigate extends Action {
    nav: NavigationRecord
}

export function navigate(nav: NavigationRecord): Navigate {
    return {
        actionType: ActionType.Navigate,
        nav
    }
}
