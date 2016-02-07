import { State, Action, ActionType } from '../redux';
import { Navigate } from '../actions';

function navigate(state: State, { route }: Navigate): State {
    return Object.assign({}, state,
        { route }
    );
}

export default function root(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.Navigate:
            return navigate(state, action as any);
        default:
            return state;
    }
}
