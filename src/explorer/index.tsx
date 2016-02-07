/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createHistory }  from 'history';
let useQueries = require('history/lib/useQueries');
let history = useQueries(createHistory)();

import App from './components/app';
import Service from './service';

import { defaultState } from './state';
import { Provider, createStore } from './redux';
import { ThemeProvider, ThemeType } from './components/theme';

import rootReducer from './reducers';

import PluginRegistry from './plugins';
import tsPlugin from './plugins/ts';
let plugins = new PluginRegistry();
plugins.register(tsPlugin);

let service = new Service(require('../../example/doc/registry.js'));
let store = createStore(rootReducer, defaultState(service, plugins));

export function runApp() {
    let reactApp = document.createElement('div');
    reactApp.id = 'react-app';
    document.body.appendChild(reactApp);

    ReactDOM.render(
        <Provider store={ store }>
            <ThemeProvider theme={ ThemeType.White }>
                <App history={ history } />
            </ThemeProvider>
        </Provider>,
        reactApp
    );
}

document.addEventListener('DOMContentLoaded', runApp, false);
