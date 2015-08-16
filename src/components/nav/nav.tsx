import React from 'react';
import block from 'bem-cn';
import { omit } from 'lodash';
import * as path from 'path';

import { Link } from '../link/link';
import { File } from '../file/file';

import { NavigationRecord } from '../../state-i';
import { Service } from '../../service';
import { Flux } from '../../flux';

import {  } from '../../doc/doc';
import { Package, getFileStructure } from '../../service';

let navCn = block('nav');
require('./nav.css');

export interface NavProps extends React.CommonAttributes {
    navigation: NavigationRecord;
    service: Service
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
                Navigation
            </div>
            <div className={ navCn('struct') }>
                {
                    this.renderFileItems(
                        service.getPackage(
                            navigation.pkg
                        ),
                        navigation.path
                    )
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

    renderFileItems(pkg: Package, targetPath: string) {
        let pkgName = pkg.info.name;
        let structure = getFileStructure(pkg, targetPath);

        let files = [];

        if (structure.prevExists) {
            files.push(
                <File
                    pkg={ pkgName }
                    pseudo={ true }
                    name={ structure.prevName || '/' }
                    path={ structure.prevPath }
                    className={ navCn('struct-item') }
                />
            );
        }

        // if (structure.currentName) {
        //     files.push(
        //         <File
        //             pkg={ pkgName }
        //             folder={ true }
        //             name={ structure.currentName || '/' }
        //             path={ structure.currentName || '/' }
        //         />
        //     );
        // }

        files = files.concat(structure.folders.map((folder) => {
            return <File
                pkg={ pkgName }
                folder={ true }
                name={ folder }
                path={ folder }
                className={ navCn('struct-item') }
            />
        }));

        files = files.concat(structure.files.map((file) => {
            return <File
                pkg={ pkgName }
                name={ file }
                path={ path.join(targetPath, file) }
                className={ navCn('struct-item') }
            />
        }));

        return files;
    }
}
