import * as React from 'react';
import * as path from 'path';
import * as theme from '../theme';

import autobind from '../../../lib/autobind';

import File from '../file';
import Service from '../../service';
import { Route } from '../../state';

let block = theme.block('nav');
require('./index.css');

export interface NavProps extends React.CommonProps {
    route: Route;
    service: Service;
    onNavigate: (route: Route) => void;
}

export interface NavState {}

export default class Nav extends React.Component<NavProps, NavState> {
    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let { route } = this.props;

        return (
            <div { ...this.props } className={ this.getClassName() }>
                <div key='section' className={ block('section') }>
                    { route.pkg ? route.pkg : 'Packages' }
                    <img
                        className={ block('all-pkg-icon') }
                        src={ require('./list.svg') }
                        onClick={ this.onNavAllClick }
                    />
                </div>
                <div key='struct' className={ block('struct') }>
                    {
                        route.pkg
                            ? this.renderFileItems(route)
                            : this.renderPkgItems()
                    }
                </div>
            </div>
        );
    }

    renderPkgItems() {
        let packages = this.props.service.getPackages();
        return Object.keys(packages).map(pkgName => {
            return <File
                key={ pkgName }
                pkg={ pkgName }
                folder={ true }
                name={ pkgName }
                path={ '/' }
                className={ block('struct-item') }
                navigate={ this.props.onNavigate }
            />;
        });
    }

    renderFileItems(route: Route) {
        let pkgName = route.pkg;
        let structure = this.props.service.getFileStructure(route);
        let files = [];

        if (structure.prevExists) {
            files.push(
                <File
                    key={ `${ pkgName }-${ structure.prevPath }`}
                    icon={ require('./left-arrow.svg') }
                    pkg={ pkgName }
                    pseudo={ true }
                    folder={ true }
                    name={ structure.prevName || pkgName }
                    path={ structure.prevPath }
                    className={ block('struct-item') }
                    navigate={ this.props.onNavigate }
                />
            );
        }

        files = files.concat(structure.folders.map((folder) => {
            return <File
                key={ `${ pkgName }-${ folder }`}
                pkg={ pkgName }
                folder={ true }
                name={ folder }
                path={ path.join(structure.dirPath, folder) }
                className={ block('struct-item') }
                navigate={ this.props.onNavigate }
            />;
        }));

        files = files.concat(structure.files.map((file) => {
            return <File
                key={ `${ pkgName }-${ file }`}
                pkg={ pkgName }
                name={ file }
                active={ structure.isFile && file == structure.currentName }
                path={ path.join(structure.dirPath, file) }
                className={ block('struct-item') }
                navigate={ this.props.onNavigate }
            />;
        }));

        return files;
    }

    @autobind
    onNavAllClick() {
        this.props.onNavigate({ pkg: '', path: '' });
    }
}
