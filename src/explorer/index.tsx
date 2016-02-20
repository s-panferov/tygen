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

export function pathFromRoute(route: Route): string {
    let routeUrl = `/${route.pkg}${route.path}`;
    routeUrl = routeUrl.replace(/[.]/g, '~~');

    if (route.semanticId) {
        routeUrl += '?sid=' + route.semanticId;
    } else if (route.id) {
        routeUrl += '?id=' + route.id;
    }

    return routeUrl;
}

export function routeFromPath(urlPath: string, query: any, service: Service): Route {
    let parts = urlPath.split('/').filter(Boolean);
    let routePkg = parts[0];
    let routePath = '/' + parts.slice(1).join('/').replace(/~~/g, '.');
    let id = query.id || (query.sid &&
                service.getIdBySemanticId(routePkg, routePath, query.sid));

    if (id) {
        return service.getFullRoute({ id });
    } else {
        return {
            pkg: routePkg,
            path: routePath
        };
    }
}

export function createAppContainer() {
    let reactApp = document.createElement('div');
    reactApp.id = 'react-app';
    document.body.appendChild(reactApp);
    return reactApp;
}

function run(registry, appContainer) {
    let service = new Service(registry);
    let prevState = defaultState(service, plugins);
    let store = createStore(rootReducer, prevState);

    let currentLocation: Location;
    history.listen(location => {
        currentLocation = location;
        if (location.action === 'POP') {
            if (location.pathname === '/') {
                store.dispatch(
                    actions.navigate({
                        pkg: null,
                        path: ''
                    })
                );
            } else {
                store.dispatch(
                    actions.navigate(routeFromPath(location.pathname, location.query, service))
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

    ReactDOM.render(
        <Provider store={ store }>
            <ThemeProvider theme={ ThemeType.White }>
                <App history={ history } />
            </ThemeProvider>
        </Provider>,
        appContainer
    );
}

fetch('/doc/registry.json')
    .then(res => res.json())
    .then((registry) => {
        let appContainer = createAppContainer();
        run(registry, appContainer);
    })
