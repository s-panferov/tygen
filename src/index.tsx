/// <reference path="defines.d.ts" />

import React from 'react';
// import { Page } from './components/page/page';
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

let service = new Service(loadFiles() as any);

export function run() {
    $(() => {
        let stores = [
        ] as any;

        // let initialState = AppStateRecord.fromJS({
        //
        // }, allRecords);
        //
        // let fluxInst = flux.runFlux(stores, initialState);

        // ReactDOM.render(
        //     <Provider flux={ fluxInst }>{() => <App />}</Provider>,
        //     document.getElementById('react-app')
        // );
    });
}

run();
