
export enum ActionType {
    Navigate = <any>"navigate"
}

export interface Action {
    actionType?: ActionType
}

export interface INavigate {
    pkg?: string,
    path?: string
}

export function navigate(params: INavigate): INavigate {
    return _.defaults(params, {
        actionType: ActionType.Navigate,
        path: '/'
    })
}
