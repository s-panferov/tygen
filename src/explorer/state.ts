import Service from './service';

export interface State {
    service: Service;
}

export function defaultState(): State {
    return {
        service: new Service(require('../../example/doc/registry.js'))
    };
}
