import Service, { Route } from './service';

export { Route }

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
