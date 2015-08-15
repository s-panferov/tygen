import React from 'react';
import block from 'bem-cn';
import { omit } from 'lodash';
import * as path from 'path';

import { Link } from '../link/link';
import { File } from '../file/file';

import { Record } from 'immutable';
import { NavigationRecord } from '../../state-i';
import { connect, Flux } from '../../flux';

import {  } from '../../doc/doc';
import { Package, getFileStructure } from '../../service';

let navCn = block('package-nav');
require('./package-nav.css');

export interface PackageNavProps extends React.CommonAttributes {
    data?: PackageNavData;
    flux?: Flux
}

export interface PackageNavState {}

export class PackageNavData extends Record({
    navigation: null
}) {
    navigation: NavigationRecord
}

@connect(PackageNavData, (state, appState) => {
    state.navigation = appState.navigation;
})
export class PackageNav extends React.Component<PackageNavProps, PackageNavState> {
    render() {
        let { navigation } = this.props.data;
        let { service } = this.props.flux.addons;
        let props = omit(this.props, 'data');
        let className = navCn().mix(this.props.className);
        return <div { ...props } className={ className }>
            { this.renderLogo() }
            { this.renderPackage(navigation) }
            {
                this.renderFileItems(
                    service.getPackage(
                        navigation.pkg
                    ),
                    navigation.path
                )
            }
        </div>
    }

    renderLogo() {
        return (
            <Link href="#">
                <div className={ navCn('logo') }>
                    docscript
                </div>
            </Link>
        )
    }

    renderPackage(navigation: NavigationRecord) {
        return (
            <Link href="#">
                <div className={ navCn('package') }>
                    { navigation.pkg }
                </div>
            </Link>
        )
    }

    renderFileItems(pkg: Package, targetPath: string) {
        let pkgName = pkg.info.name;
        let structure = getFileStructure(pkg, targetPath);

        let files = [];

        if (structure.prevExists) {
            files.push(
                <File
                    pkg={ pkgName }
                    name={ structure.prevName || '/' }
                    path={ structure.prevPath }
                />
            );
        }

        if (structure.currentName) {
            files.push(
                <File
                    pkg={ pkgName }
                    name={ structure.currentName || '/' }
                    path={ structure.currentName || '/' }
                />
            );
        }

        files = files.concat(structure.folders.map((folder) => {
            return <File
                pkg={ pkgName }
                name={ folder }
                path={ folder }
            />
        }));

        files = files.concat(structure.files.map((file) => {
            return <File
                pkg={ pkgName }
                name={ file }
                path={ path.join(targetPath, file) }
            />
        }));

        return files;
    }
}
