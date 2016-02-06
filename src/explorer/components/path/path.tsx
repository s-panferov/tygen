import React from 'react';
import block from 'bem-cn';
import { omit, compact } from 'lodash';
import * as path from 'path';

import { File } from '../file/file';

import { Navigation, NavigationR } from '../../state-i';

let pathCn = block('path');
require('./path.css');

export interface PathProps extends React.CommonAttributes {
    navigation: NavigationR;
    navigate: (nav: Navigation) => void;
}

export interface PathState {}

export class Path extends React.Component<PathProps, PathState> {
    render() {
        let { navigation } = this.props;
        let className = pathCn().mix(this.props.className);

        return (
            <div className={ className }>
                <File
                    name='packages'
                    pkg={ null }
                    path={ null }
                    disabled={ !navigation.pkg }
                    className={ pathCn('item') }
                    navigate={ this.props.navigate }
                />

                {
                    navigation.pkg && <File
                        name={ navigation.pkg }
                        pkg={ navigation.pkg }
                        path={ '/' }
                        className={ pathCn('item') }
                        navigate={ this.props.navigate }
                    />
                }

                {
                    navigation.pkg && this.renderPath(navigation)
                }
            </div>
        )
    }

    renderPath(navigation: NavigationR) {
        let sections = [];
        let pathSections = compact(navigation.path.split(path.sep));

        return pathSections.map((item, i) => {
            let before = pathSections.slice(0, i + 1);
            before.unshift('/');
            let fullPath = path.join.apply(path, before);
            return (
                <File
                    name={ item }
                    pkg={ navigation.pkg }
                    path={ fullPath }
                    className={ pathCn('item') }
                    disabled={ i == pathSections.length - 1 }
                    navigate={ this.props.navigate }
                />
            )
        })
    }
}
