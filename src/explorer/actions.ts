import { Action } from './redux';
import { Route } from './state';

export enum ActionType {
    Navigate = 'Navigate' as any,
}

export interface Navigate extends Action {
    route: Route;
}
export function navigate(route: Route): Navigate {
    return {
        type: ActionType.Navigate,
        route
    };
}
