import thunk from 'redux-thunk';
import { compose } from 'redux';
export { Provider } from 'react-redux';

import {
    Action as ReduxAction,
    Store as ReduxStore,
    Dispatch as ReduxDispatch,
    createStore as createStore_,
    applyMiddleware,
    Reducer,
} from 'redux';

import {
    Connect,
    connect as reduxConnect,
    DispatchProps as ReduxDispatchProps
} from 'react-redux';

import * as actions from './actions';
import { ActionType } from './actions';
export { ActionType, actions };

import { State } from './state';
export { State };

export type Action = ReduxAction<ActionType>;
export type Store = ReduxStore<State, Action>;
export type Dispatch = ReduxDispatch<State, Action>;
export type ActionCreators = typeof actions;
export type DispatchProps = ReduxDispatchProps<State, Action>;
export type RootReducer = Reducer<State, Action>;

export let connect: Connect<State, Action, Dispatch> = reduxConnect;

let prevState = null;
const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    let state = store.getState();
    console.log('next state', state);
    prevState = state;
    return result;
};

export function createStore(reducer: RootReducer, initialState: State): Store {
    const finalCreateStore = compose(
        applyMiddleware(thunk, logger)
    )(createStore_);

    let store = finalCreateStore(reducer, initialState);

    return store;
}
