import { NavigationR } from './state-i';
import allRecords from './records';

export enum ActionType {
    Navigate = <any>"NAVIGATE",
    Search = <any>"SEARCH"
}

export interface Action {
    actionType?: ActionType
}

export interface Navigate extends Action {
    nav: NavigationR
}

export interface Search extends Action {
    query: string
}


export function navigate(nav_: NavigationR | { pkg: string, path: string }): Navigate {
    let nav = ensureRecord(NavigationR, nav_, allRecords);
    return {
        actionType: ActionType.Navigate,
        nav
    }
}

export function search(query: string): Search {
    return {
        actionType: ActionType.Search,
        query: query
    }
}

function ensureRecord<T>(record: { new (arg: any): T } & { fromJS: any }, val: any, allRecords: any): T {
    if (val instanceof record) {
        return val;
    } else {
        return record.fromJS(val, allRecords);
    }
}
