declare module 'redux' {
    interface Action<T> {
        type: T;
    }

    interface ActionFunction<S, A> {
        (dispatch: Dispatch<S, A>, getState: () => S): void;
    }

    interface ActionCreator<S, A> {
        (...args: any[]): A | ActionFunction<S, A>;
    }

    interface ActionCreators<S, A> {
        [key: string]: ActionCreator<S, A>;
    }

    interface Reducer<S, A> {
        (state: S, action: A): S;
    }

    interface Reducers<S, A> {
        [key: string]: Reducer<S, A>;
    }

    interface Dispatch<S, A> {
        (action: A | ActionFunction<S, A>): A;
    }

    interface StoreMethods<S, A> {
        dispatch: Dispatch<S, A>;
        getState(): S;
    }

    interface MiddlewareArg<S, A> {
        dispatch: Dispatch<S, A>;
        getState: () => S;
    }

    interface Middleware<S, A> {
        // TODO @spanferov Write proper types
        (obj: MiddlewareArg<S, A>): Function;
    }

    interface Store<S, A> {
        dispatch: Dispatch<S, A>;
        getReducer(): Reducer<S, A>;
        replaceReducer(nextReducer: Reducer<S, A>): void;
        getState(): S;
        // TODO @spanferov Write proper types
        subscribe(listener: Function): Function;
    }

    interface StoreCreator<S, A> {
        (reducer: Reducer<S, A>, initialState?: S): Store<S, A>;
    }

    export function createStore<S, A>(reducer: Reducer<S, A>, initialState?: S): Store<S, A>;
    export function bindActionCreators<S, A>(actionCreators: ActionCreators<S, A>, dispatch: Dispatch<S, A>): ActionCreators<S, A>;
    export function combineReducers<S, A>(reducers: Reducers<S, A>): Reducer<S, A>;
    export function applyMiddleware<S, A>(...middleware: Middleware<S, A>[]): (createStore: StoreCreator<S, A>) => StoreCreator<S,A>;
    export function compose(...functions: Function[]): Function;
}
