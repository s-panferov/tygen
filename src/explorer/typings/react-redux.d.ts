declare module 'react-redux' {
    import * as React from 'react';
    import * as redux from 'redux';

    interface ProviderProps {
        store: redux.Store<any, any>;
    }

    interface ProviderState {
        store: redux.Store<any, any>;
    }

    class Provider extends React.Component<ProviderProps, ProviderState> {}

    interface ConnectorProps {
        children: Function;
        select: Function;
    }

    class Connector extends React.Component<ConnectorProps, any> {}

    interface ConnectorOptions {
        /**
         * If true, implements shouldComponentUpdate and shallowly compares
         * the result of mergeProps, preventing unnecessary updates,
         * assuming that the component is a “pure” component and does not rely
         * on any input or state other than its props and the selected
         * Redux store’s state. Defaults to true.
         */
        pure: boolean;
    }

    interface DispatchProps<S, A> {
        dispatch?: redux.Dispatch<S, A>;
    }

    interface MapStateToProps<P, State, StateProps> {
        (state: State, ownProps: P): StateProps;
    }

    interface MapDispatchToProps<P, Dispatch> {
        (state: Dispatch, ownProps: P): any;
    }

    interface MergeProps<P, StateProps, DispatchProps> {
        (stateProps: StateProps, dispatchProps: DispatchProps, ownProps: P): P;
    }

    interface Connect<State, Action, Dispatch> {
        <P, StateProps, DispatchProps>(
            /**
             * If specified, the component will subscribe to Redux store updates.
             * Any time it updates, mapStateToProps will be called.
             * Its result must be a plain object, and it will be merged into the component’s props.
             * If you omit it, the component will not be subscribed to the Redux store.
             * If ownProps is specified as a second argument, then mapStateToProps will
             * be re-invoked whenever the component receives new props.
             */
            mapStateToProps?: MapStateToProps<P, State, StateProps>,
            /**
             * If an object is passed, each function inside it will be assumed
             * to be a Redux action creator. An object with the same function names,
             * but bound to a Redux store, will be merged into the component’s props.
             * If a function is passed, it will be given dispatch. It’s up to you
             * to return an object that somehow uses dispatch to bind action creators in your own way.
             * (Tip: you may use the bindActionCreators() helper from Redux.)
             * If you omit it, the default implementation just injects dispatch into your
             * component’s props. If ownProps is specified as a second argument,
             * then mapDispatchToProps will be re-invoked whenever the component receives new props.
             */
            mapDispatchToProps?: redux.ActionCreators<State, Action> | MapDispatchToProps<P, Dispatch>,
            /**
             * If specified, it is passed the result of mapStateToProps(), mapDispatchToProps(), and the parent props.
             * The plain object you return from it will be passed as props to the wrapped component.
             * You may specify this function to select a slice of the state based on props,
             * or to bind action creators to a particular variable from props.
             * If you omit it, Object.assign({}, ownProps, stateProps, dispatchProps) is used by default.
             */
            mergeProps?: MergeProps<P, StateProps, DispatchProps>,
            /**
             * If specified, further customizes the behavior of the connector.
             */
            options?: ConnectorOptions
        )
    }

    let connect: Connect<any, any, redux.Dispatch<any, any>>;
}
