import * as React from 'react';
import * as theme from '../theme';

import { Route, PluginRegistry } from '../../state';
import { ModuleInfo } from '../../../doc/index';
import { Item } from '../../../doc/items';

import Breadcrumbs from '../breadcrumbs';
import File from '../file';

require('./index.css');
const block = theme.block('module');

export interface ModuleProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    route: Route;
    module: ModuleInfo;
    item: Item;
    plugins: PluginRegistry;

    onNavigate: (route: Route) => void;
}
export interface ModuleState {}

export default class Module extends React.Component<ModuleProps, ModuleState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <div className={ block('header') }>
                    <Breadcrumbs>
                        { this.renderRoute() }
                    </Breadcrumbs>
                </div>
                <div className={ block('content') }>
                    { this.renderView() }
                </div>
            </div>
        );
    }

    renderView(): React.ReactNode {
        let { module, plugins } = this.props;

        if (this.props.module) {
            let Component = plugins.getModuleComponent(module);
            return (
                <Component
                    className={ block('view') }
                    route={ this.props.route }
                    item={ this.props.item }
                    module={ module }
                />
            );
        }
    }

    renderRoute() {
        let files = [];
        let route = this.props.route;

        files.push(
            <File
                key={ route.pkg }
                folder={ true }
                name={ route.pkg }
                pkg={ route.pkg }
                path={ '/' }
                className={ block('struct-item') }
                navigate={ this.props.onNavigate }
            />
        );

        if (this.props.route.path !== '/') {
            let parts = this.props.route.path.split('/').filter(Boolean);
            parts.reduce((p: string, segment: string, i: number): string => {
                let currentPath = `${ p }/${ segment }`;
                files.push(
                    <File
                        key={ `${route.pkg}-${segment}` }
                        folder={ true }
                        name={ segment }
                        pkg={ route.pkg }
                        path={ currentPath }
                        active={ i == parts.length - 1 }
                        className={ block('struct-item') }
                        navigate={ this.props.onNavigate }
                    />
                );
                return currentPath;
            }, '');
        }

        return files;
    }
}
