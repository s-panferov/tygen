import * as React from 'react';
import { ModuleInfo } from '../doc';
import { Item } from '../doc/items';
import { Route } from './service';

export interface Plugin {
    (reg: PluginRegistry): void;
}

export interface ModuleComponentProps extends React.CommonProps {
    route: Route;
    module: ModuleInfo;
    item: Item;
}

export type ModuleComponentCtor = React.ReactCtor<ModuleComponentProps, any>;

export interface ModulePlugin {
    isAcceptableModule(module: ModuleInfo): boolean;
    getModuleComponent(): ModuleComponentCtor;
}

export default class PluginRegistry {
    modulePlugins: ModulePlugin[] = [];

    register(plugin: Plugin) {
        plugin(this);
    }

    registerModulePlugin(plugin: ModulePlugin) {
        this.modulePlugins.push(plugin);
    }

    getModuleComponent(module: ModuleInfo): ModuleComponentCtor {
        return this.modulePlugins
            .find(plugin => plugin.isAcceptableModule(module))
            .getModuleComponent();
    }
}
