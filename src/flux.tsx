import {
    createAll,
    runFlux as _runFlux,
    Store as _Store,
    Action as _Action,
    Flux as _Flux,
    FluxProps as _FluxProps,
    ConnectorContext as _ConnectorContext
} from 'tsflux/index';

import {
    AppStateRecord
} from './state-i';

export type State = AppStateRecord;

import React from 'react';
import * as actions from './actions';
import { ActionType } from './actions';

import { Map, fromJS } from 'immutable';
import { EventEmitter } from 'events';
import { Dispatcher as FluxDispatcher } from 'flux';

export type Action = _Action<ActionType>;
export type Store<StoreState> = _Store<ActionType, typeof actions, StoreState, State>;
export type Flux = _Flux<ActionType, State, typeof actions>;
export type FluxProps = _FluxProps<ActionType>;
export type ConnectorContext = _ConnectorContext<Action, typeof actions, State>;
export type ActionCreators = typeof actions;

let { Connector, connect, Provider } = createAll<ActionType, ActionCreators, State>(React, fromJS);
export { Connector, connect, Provider };
export { Map, fromJS };

export function runFlux(stores, initialState): Flux {
    let ds = new FluxDispatcher();
    let events = new EventEmitter();

    return _runFlux<ActionType, ActionCreators, State, Action>(stores, initialState, ds, events, actions as any);
}
