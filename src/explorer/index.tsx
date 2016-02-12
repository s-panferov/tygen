/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createHistory, History, Location }  from 'history';
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
import tsPlugin from '../explorer-ts';
let plugins = new PluginRegistry();
plugins.register(tsPlugin);

let service = new Service(require('../../example/doc/registry.js'));
let prevState = defaultState(service, plugins);
let store = createStore(rootReducer, prevState);

export function pathFromRoute(route: Route): string {
    let routeUrl = `/${route.pkg}${route.path}`;
    routeUrl = routeUrl.replace('.', '~~');

    if (route.id) {
        routeUrl += '?id=' + route.id;
    }

    return routeUrl;
}

function routeFromPath(urlPath: string, query: any): Route {
    let parts = urlPath.split('/').filter(Boolean);
    return {
        pkg: parts[0],
        path: '/' + parts.slice(1).join('/').replace('~~', '.'),
        id: query.id
    };
}

let currentLocation: Location;
history.listen(location => {
    currentLocation = location;
    if (location.action === 'POP') {
        if (location.pathname === '/') {
            let mainPackage = service.getMainPackageName();
            history.replaceState(null, `/${mainPackage}/`);

            store.dispatch(
                actions.navigate({
                    pkg: mainPackage,
                    path: location.pathname
                })
            );
        } else {
            store.dispatch(
                actions.navigate(routeFromPath(location.pathname, location.query))
            );
        }
    }
});

store.subscribe(() => {
    let state = store.getState();

    if (!equal(prevState.route, state.route)) {
        let newPathName = pathFromRoute(state.route);
        if (!currentLocation || (currentLocation && currentLocation.pathname !== newPathName)) {
            history.push({
                pathname: newPathName
            });
        }
    }

    prevState = state;
});

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
