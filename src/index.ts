/// <reference path="defines.d.ts" />

import { render, createElement } from 'react';
import { Page } from './components/page/page';
import { Service } from './service';
import { Dispatcher as FluxDispatcher } from 'flux';
import { EventEmitter } from 'events';

import { Map, fromJS } from 'immutable';

import { IAction } from './actions';

export type IDispatcher = FluxDispatcher<IAction>;
export type IState = Map<string, any>;

import * as _ from 'lodash';

require('./css/main.css');

var injectTapEventPlugin = require("react-tap-event-plugin");

function loadFiles() {
    return require('../.docs/registry.js')
}

let service = new Service(<any>loadFiles());
let ds: IDispatcher = new FluxDispatcher<any>();
let events = new EventEmitter();

export interface IEnv {
    service: Service,
    events: EventEmitter,
    ds: IDispatcher,
    getState(): IState
}

let jsState = {};
let state: IState;

let env: IEnv = { service, events, ds, getState: () => state };

import { navigation } from './stores/navigation';

let stores: IStore[] = [
    navigation,
];

interface IStore {
    (state: IState, action: IAction, env: IEnv, states?: IStates): IState
}

interface IStates {
    currentState: IState,
    prevState: IState
}

let states: IStates = {
    currentState: null,
    prevState: null
};

ds.register((action) => {
    states.prevState = state;
});

stores.forEach((store) => {
    jsState[store.name] = {};
    ds.register((action) => {
        let prevLocalState = state.get(store.name);
        let newLocalState = store(prevLocalState, action, env, states) || prevLocalState;
        if (prevLocalState !== newLocalState) {
            let currentState = state.set(store.name, newLocalState);
            states.currentState = <any>currentState;
            console.log('state changed by', store.name, prevLocalState.toJS(), newLocalState.toJS());
            state = <any>currentState;
            events.emit(store.name, currentState, state);
        }
    })
});

state = fromJS(jsState);

stores.forEach((store) => {
    let localState = state.get(store.name);
    state = <any>state.set(store.name, store(localState, null, env) || localState)
});

(<any>window).getState = () => state;

injectTapEventPlugin();

window.onload = () => {
    render(Page({ env }), document.body)
};