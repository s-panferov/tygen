import React from 'react';
import block from 'bem-cn';
import { omit } from 'lodash';
import * as path from 'path';

import { Link } from '../link/link';
import { File } from '../file/file';

import { Navigation, NavigationRecord } from '../../state-i';
import { Service } from '../../service';
import { Flux } from '../../flux';

import {  } from '../../doc/doc';
import { Package, getFileStructure } from '../../service';

let navCn = block('nav');
require('./nav.css');

export interface NavProps extends React.CommonAttributes {
    navigation: NavigationRecord;
    service: Service;
    navigate: (nav: Navigation) => void
}

export interface NavState {}

export class Nav extends React.Component<NavProps, NavState> {
    render() {
        let { navigation, service } = this.props;
        let props = omit(this.props, 'data');
        let className = navCn().mix(this.props.className);
        return <div { ...props } className={ className }>
            { this.renderLogo() }
            <div className={ navCn('section') }>
                { navigation.pkg ? navigation.pkg : 'Packages' }
            </div>
            <div className={ navCn('struct') }>
                {
                    navigation.pkg
                        ? this.renderFileItems(
                            service.getPackage(
                                navigation.pkg
                            ),
                            navigation.path
                        )
                        : this.renderPkgItems()
                }
            </div>
        </div>
    }

    renderLogo() {
        return (
            <Link href="#">
                <div className={ navCn('logo') }>
                    {'//'}DocScript
                </div>
            </Link>
        )
    }

    renderPkgItems() {
        let packages = this.props.service.getPackages();
        return Object.keys(packages).map(pkgName => {
            return <File
                pkg={ pkgName }
                folder={ true }
                name={ pkgName }
                path={ '/' }
                className={ navCn('struct-item') }
                navigate={ this.props.navigate }
            />
        })
    }

    renderFileItems(pkg: Package, targetPath: string) {
        let pkgName = pkg.info.name;

        let structure = getFileStructure(pkg, targetPath);

        let files = [];

        if (structure.prevExists) {
            files.push(
                <File
                    pkg={ pkgName }
                    pseudo={ true }
                    folder={ true }
                    name={ structure.prevName || '/' }
                    path={ structure.prevPath }
                    className={ navCn('struct-item') }
                    navigate={ this.props.navigate }
                />
            );
        }

        files = files.concat(structure.folders.map((folder) => {
            return <File
                pkg={ pkgName }
                folder={ true }
                name={ folder }
                path={ path.join(structure.dirPath, folder) }
                className={ navCn('struct-item') }
                navigate={ this.props.navigate }
            />
        }));

        files = files.concat(structure.files.map((file) => {
            return <File
                pkg={ pkgName }
                name={ file }
                active={ structure.isFile && file == structure.currentName }
                path={ path.join(structure.dirPath, file) }
                className={ navCn('struct-item') }
                navigate={ this.props.navigate }
            />
        }));

        return files;
    }
}
