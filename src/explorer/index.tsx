/// <reference path="./defines.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import equal from '../lib/equal'
import rootReducer from './reducers'

import { defaultState, Route, State } from './state'
import { Provider, createStore, actions } from './redux'
import { ThemeProvider, ThemeType } from './components/theme'
import { waitForEl } from './helpers'
import { inflateJson } from '../lib/inflate'
import { defaultSettings } from './settings'

import App from './components/app'
import Service, { routeFromPath, pathFromRoute } from './service'

import { History, Location } from 'history'
let createHistory = require('history/lib/createHashHistory')
let useQueries = require('history/lib/useQueries')
let history: History = useQueries(createHistory)()

import PluginRegistry from './plugins'
import tsPlugin from '../explorer-ts'
let plugins = new PluginRegistry()
plugins.register(tsPlugin)

let settings = defaultSettings()

export function createAppContainer() {
	let reactApp = document.createElement('div')
	reactApp.id = 'react-app'
	document.body.appendChild(reactApp)
	return reactApp
}

function run(registry, appContainer) {
	let service = new Service(registry, settings)
	let search = new Worker(`${settings.assetsRoot}/search-index.js`)

	let prevState = defaultState(service, plugins, search, settings)
	let store = createStore(rootReducer, prevState)

	search.postMessage(actions.initSearchIndex(settings))
	search.addEventListener('message', (e: MessageEvent) => {
		store.dispatch(e.data)
	})
	search.addEventListener('error', (e) => {
		console.log(e)
	})

	let currentLocation: Location
	history.listen(location => {
		currentLocation = location
		if (location.action === 'POP') {
			if (location.pathname === '/') {
				store.dispatch(
					actions.navigate(service.getDefaultRoute())
				)
			} else {
				store.dispatch(
					actions.navigate(routeFromPath(location.pathname, location.query, service))
				)
			}
		}
	})

	store.subscribe(() => {
		let state = store.getState()

		if (prevState.item !== state.item) {
			scroll(state)
		}

		if (prevState.module !== state.module) {
			scroll(state)
		}

		if (!equal(prevState.route, state.route)) {
			let newPathName = pathFromRoute(state.route)
			let currentPathName = currentLocation.pathname + currentLocation.search

			if (!currentLocation || (currentLocation && currentPathName !== newPathName)) {
				history.push({
					pathname: newPathName
				})
			}

			scroll(state)
		}

		prevState = state
	})

	(window as any).__store = store

	ReactDOM.render(
		<Provider store={store}>
			<ThemeProvider theme={ThemeType.White}>
				<App history={history} />
			</ThemeProvider>
		</Provider>,
		appContainer
	)
}

function scroll(state: State) {
	if (state.route.id) {
		waitForEl(state.route.id, (el) => {
			if (el) {
				window.scrollTo(0, el.offsetTop - 50)
			}
		})
	} else {
		window.scrollTo(0, 0 - 50)
	}
}

fetch(`${settings.docRoot}/registry.json.gz`)
	.then(res => inflateJson(res))
	.then((registry) => {
		let appContainer = createAppContainer()
		run(registry, appContainer)
	})
