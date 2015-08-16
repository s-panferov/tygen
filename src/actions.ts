import { NavigationRecord } from './state-i';
import allRecords from './records';

export enum ActionType {
    Navigate = <any>"NAVIGATE"
}

export interface Action {
    actionType?: ActionType
}

export interface Navigate extends Action {
    nav: NavigationRecord
}

export function navigate(nav_: NavigationRecord | { pkg: string, path: string }): Navigate {
    let nav: NavigationRecord;
    if (nav_ instanceof NavigationRecord) {
        nav = nav_;
    } else {
        nav = NavigationRecord.fromJS(nav_, allRecords);
    }
    return {
        actionType: ActionType.Navigate,
        nav
    }
}
