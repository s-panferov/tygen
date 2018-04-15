import thunk from 'redux-thunk'
import { compose } from 'redux'
export { Provider } from 'react-redux'

import {
	FSA,
	Store as ReduxStore,
	Dispatch as ReduxDispatch,
	createStore as createStore_,
	applyMiddleware,
	Reducer
} from 'redux'

import { Connect, connect as reduxConnect, DispatchProps as ReduxDispatchProps } from 'react-redux'

import * as actions from './actions'
import { ActionType } from './actions'
export { ActionType, actions }

import { State } from './state'
export { State }

export type Action<P, M> = FSA<ActionType, P, M>
export type Store = ReduxStore<State, Action<any, any>>
export type Dispatch = ReduxDispatch<State, Action<any, any>>
export type ActionCreators = typeof actions
export type DispatchProps = ReduxDispatchProps<State, Action<any, any>>
export type RootReducer = Reducer<State, Action<any, any>>
export type GetState = () => State

export let connect: Connect<State, Action<any, any>, Dispatch> = reduxConnect

let prevState = null
const logger = store => next => action => {
	console.log('dispatching', action)
	let result = next(action)
	let state = store.getState()
	console.log('next state', state)
	prevState = state
	return result
}

export function createStore(reducer: RootReducer, initialState: State): Store {
	const finalCreateStore = compose(applyMiddleware(thunk, logger))(createStore_)

	let store = finalCreateStore(reducer, initialState)

	return store
}
