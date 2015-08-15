/// <reference path="defines.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Service } from './service';
import { EventEmitter } from 'events';
import { Map, fromJS } from 'immutable';
import { Action } from './actions';

import { Provider, runFlux } from './flux';
import { Page } from './components/page/page';
import { navigation } from './stores/navigation';
import { AppRecord } from './state-i';
import allRecords from './records';

import * as _ from 'lodash';

require('./index.css');

function loadFiles() {
    return require('../.docs/registry.js')
}

let service = new Service(loadFiles() as any);

export function run() {
    $(() => {
        let stores = [
            navigation
        ] as any;

        let initialState = AppRecord.fromJS({
            navigation: {
                pkg: service.getMainPackageName(),
                path: '/'
            }
        }, allRecords);

        let fluxInst = runFlux(stores, initialState, { service });

        ReactDOM.render(
            <Provider flux={ fluxInst }>{() => <Page />}</Provider>,
            document.getElementById('react-app')
        );
    });
}

run();
