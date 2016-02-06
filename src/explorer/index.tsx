/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createHistory }  from 'history';
let useQueries = require('history/lib/useQueries');
let history = useQueries(createHistory)();

import Explorer from './components/explorer';
import { Provider, createStore } from './redux';

import rootReducer from './reducers';

let store = createStore(rootReducer, {});

export function runApp() {
    let reactApp = document.createElement('div');
    reactApp.id = 'react-app';
    document.body.appendChild(reactApp);

    ReactDOM.render(
        <Provider store={ store }>
            <Explorer history={ history } />
        </Provider>,
        reactApp
    );
}

document.addEventListener('DOMContentLoaded', runApp, false);
