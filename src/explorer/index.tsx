/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createHistory, History }  from 'history';
let useQueries = require('history/lib/useQueries');
let history: History = useQueries(createHistory)();

import App from './components/app';
import Service from './service';

import { defaultState, Route } from './state';
import { Provider, createStore, actions } from './redux';
import { ThemeProvider, ThemeType } from './components/theme';
import equal from '../lib/equal';
import rootReducer from './reducers';

import PluginRegistry from './plugins';
import tsPlugin from './plugins/ts';
let plugins = new PluginRegistry();
plugins.register(tsPlugin);

let service = new Service(require('../../example/doc/registry.js'));
let prevState = defaultState(service, plugins);
let store = createStore(rootReducer, prevState);

function routeUrl(route: Route): string {
    let routeUrl = `/${route.pkg}${route.path}`;
    routeUrl = routeUrl.replace('.', '~~');

    return routeUrl;
}

store.subscribe(() => {
    let state = store.getState();

    if (!equal(prevState.route, state.route)) {
        history.pushState(null, routeUrl(state.route), null);
    }

    prevState = state;
});
//
// history.listen(location => {
//     if (location.action === 'REPLACE') {
//         return;
//     }
//
//     if (location.pathname === '/') {
//         let mainPackage = service.getMainPackageName();
//         history.replaceState(null, `/${mainPackage}/`);
//
//         store.dispatch(
//             actions.navigate({
//                 pkg: mainPackage,
//                 path: location.pathname
//             })
//         );
//     } else {
//         let parts = location.pathname.split('/').filter(Boolean);
//         store.dispatch(
//             actions.navigate({
//                 pkg: parts[0],
//                 path: '/' + parts.slice(1).join('/')
//             })
//         );
//     }
// });

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
