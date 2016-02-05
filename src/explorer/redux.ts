import thunk from 'redux-thunk';
import { compose } from 'redux';
export { Provider } from 'react-redux';

import {
    createStore as createStore_,
    applyMiddleware,
    Store
} from 'redux';

let prevState = null;
const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    let state = store.getState();
    console.log('next state', state);
    prevState = state;
    return result;
};

export function createStore<S, A>(reducer, initialState: S): Store<S, A> {
    const finalCreateStore = compose(
        applyMiddleware(thunk, logger)
    )(createStore_);

    let store = finalCreateStore(reducer, initialState);

    return store;
}
