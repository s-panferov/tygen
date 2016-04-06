import Service, { Route } from './service';
import PluginRegistry from './plugins';
import { ModuleInfo, Item } from '../doc';
import { Settings, DisplaySettings } from './settings';

export { Route, PluginRegistry }

import ActivityManager from './activity';

export type SearchResult = string[];

export interface State {
    activity?: ActivityManager;
    service?: Service;
    route?: Route;
    module?: ModuleInfo;
    item?: Item;
    plugins?: PluginRegistry;
    searchActive?: boolean;
    searchQuery?: string;
    searchIndex?: Worker;
    searchIndexReady?: boolean;
    searchInProgress?: boolean;
    searchResults?: SearchResult;
    settings?: Settings;
    displaySettings?: DisplaySettings;
}

export function defaultState(
    service: Service,
    plugins: PluginRegistry,
    searchIndex: Worker,
    settings: Settings
): State {
    return {
        settings,
        searchActive: false,
        searchQuery: '',
        searchIndex,
        searchInProgress: false,
        searchIndexReady: false,
        displaySettings: {
            inherited: false,
            public: true,
            exported: true
        },
        activity: new ActivityManager(),
        service,
        plugins,
        module: null,
        item: null,
        route: {
            pkg: service.getMainPackageName(),
            path: '/'
        }
    };
}
