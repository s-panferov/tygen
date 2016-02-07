import Service from './service';

export interface Route {
    pkg: string;
    path: string;
}

export interface State {
    service?: Service;
    route?: Route;
}

export function defaultState(service: Service): State {
    return {
        service,
        route: {
            pkg: service.getMainPackageName(),
            path: '/'
        }
    };
}
