import * as React from 'react';
import * as path from 'path';
import * as theme from '../theme';

import autobind from '../../../lib/autobind';

import Link from '../link';
import File from '../file';
import Service, { PackageService } from '../../service';
import { Route } from '../../state';
import { connect, DispatchProps, actions } from '../../redux';

import { getFileStructure } from '../../service';

let block = theme.block('nav');
require('./index.css');

export interface NavReduxProps extends DispatchProps {
    route?: Route;
    service?: Service;
}

export interface NavProps extends React.CommonProps, NavReduxProps {

}

export interface NavState {}

@connect(({ route, service }): NavReduxProps => {
    return {
        route,
        service
    };
})
export default class Nav extends React.Component<NavProps, NavState> {
    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let { route, service } = this.props;

        return (
            <div { ...this.props } className={ this.getClassName() }>
                { this.renderLogo() }
                <div key='section' className={ block('section') }>
                    { route.pkg ? route.pkg : 'Packages' }
                </div>
                <div key='struct' className={ block('struct') }>
                    {
                        route.pkg
                            ? this.renderFileItems(
                                service.getPackage(
                                    route.pkg
                                ),
                                route.path
                            )
                            : this.renderPkgItems()
                    }
                </div>
            </div>
        );
    }

    renderLogo() {
        return (
            <Link htmlProps={{ href: '#' }}>
                <div className={ block('logo') }>
                    {'//'}DocScript
                </div>
            </Link>
        );
    }

    renderPkgItems() {
        let packages = this.props.service.getPackages();
        return Object.keys(packages).map(pkgName => {
            return <File
                pkg={ pkgName }
                folder={ true }
                name={ pkgName }
                path={ '/' }
                className={ block('struct-item') }
                navigate={ this.onNavigate }
            />;
        });
    }

    @autobind
    onNavigate(route: Route) {
        this.props.dispatch(
            actions.navigate(route)
        );
    }

    renderFileItems(pkg: PackageService, targetPath: string) {
        let pkgName = pkg.info.name;

        let structure = getFileStructure(pkg, targetPath);
        let files = [];

        if (structure.prevExists) {
            files.push(
                <File
                    key={ `${ pkgName }-${ structure.prevPath }`}
                    pkg={ pkgName }
                    pseudo={ true }
                    folder={ true }
                    name={ structure.prevName || '/' }
                    path={ structure.prevPath }
                    className={ block('struct-item') }
                    navigate={ this.onNavigate }
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
                navigate={ this.onNavigate }
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
                navigate={ this.onNavigate }
            />;
        }));

        return files;
    }
}
