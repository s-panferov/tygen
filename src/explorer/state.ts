import Service, { Route } from './service';
import PluginRegistry from './plugins';

export { Route, PluginRegistry }

export interface State {
    service?: Service;
    route?: Route;
    plugins?: PluginRegistry;
}

export function defaultState(service: Service, plugins: PluginRegistry): State {
    return {
        service,
        plugins,
        route: {
            pkg: service.getMainPackageName(),
            path: '/'
        }
    };
}
