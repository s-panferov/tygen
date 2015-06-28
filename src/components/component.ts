import { IState, IEnv } from './../index';
import { Map } from 'immutable';
import * as _ from 'lodash';

export interface Component {
    state: any;
    setState: (state: any) => void;
}

export function bindState(component: Component, binder: (currState: IState, localState: IState, globalState: IState) => any, env: IEnv) {
    if (!component.state) {
        component.state = { map: Map({}) };
    }

    if (!(<any>component).__state__listeners) {
        (<any>component).__state__listeners = [];
    }

    function getState() {
        let state = env.getState();
        return {
            map: binder(component.state.map, state.get(binder.name), state)
        };
    }

    function setState() {
        component.setState(getState())
    }

    _.extend(component.state, getState());

    env.events.addListener(binder.name, setState);
    (<any>component).__state__listeners.push([binder.name, setState])
}

export function unbindState(component: Component, env: IEnv) {
    (<any>component).__state__listeners.forEach(([name, foo]) => {
        env.events.removeListener(name, <any>foo)
    })
}

export interface IContext {
    env: IEnv
}

export interface IMap<IState> {
    map: IState
}