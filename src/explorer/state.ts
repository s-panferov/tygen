import Service, { Route } from './service';
import PluginRegistry from './plugins';
import { ModuleInfo } from '../doc';
import { Item } from '../doc/items';

export { Route, PluginRegistry }

import ActivityManager from './activity';

export interface State {
    activity?: ActivityManager;
    service?: Service;
    route?: Route;
    module?: ModuleInfo;
    item?: Item;
    items?: { [key: string]: Item };
    modules?: { [key: string]: ModuleInfo };
    plugins?: PluginRegistry;
}

export function defaultState(service: Service, plugins: PluginRegistry): State {
    return {
        activity: new ActivityManager(),
        service,
        plugins,
        modules: {},
        items: {},
        module: null,
        item: null,
        route: {
            pkg: service.getMainPackageName(),
            path: '/'
        }
    };
}
