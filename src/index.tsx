/// <reference path="defines.d.ts" />

import React from 'react';
import $ from 'jquery';
import { Service } from './service';
import { Dispatcher as FluxDispatcher } from 'flux';
import { EventEmitter } from 'events';
import { Map, fromJS } from 'immutable';
import { Action } from './actions';

import { Page } from './components/page/page';

export type IDispatcher = FluxDispatcher<Action>;
export type IState = Map<string, any>;

import * as _ from 'lodash';

require('./css/main.css');

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
