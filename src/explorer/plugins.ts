import * as React from 'react';
import { Module } from '../doc';

export interface Plugin {
    (reg: PluginRegistry): void;
}

export interface ModuleComponentProps extends React.CommonProps {
    module: Module;
}

export type ModuleComponentCtor = React.ReactCtor<ModuleComponentProps, any>;

export interface ModulePlugin {
    isAcceptableModule(module: Module): boolean;
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

    getModuleComponent(module: Module): ModuleComponentCtor {
        return this.modulePlugins
            .find(plugin => plugin.isAcceptableModule(module))
            .getModuleComponent();
    }
}
