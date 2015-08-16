import React from 'react';
import block from 'bem-cn';
import { omit, compact } from 'lodash';
import * as path from 'path';

import { File } from '../file/file';

import { NavigationRecord } from '../../state-i';

let pathCn = block('path');
require('./path.css');

export interface PathProps extends React.CommonAttributes {
    navigation: NavigationRecord
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
                    className={ pathCn('item') }
                />

                <File
                    name={ navigation.pkg }
                    pkg={ navigation.pkg }
                    path={ null }
                    className={ pathCn('item') }
                />

                { this.renderPath(navigation) }
            </div>
        )
    }

    renderPath(navigation: NavigationRecord) {
        let sections = [];
        let pathSections = compact(navigation.path.split(path.sep));

        return pathSections.map(item => {
            return (
                <File
                    name={ item }
                    path='item'
                    pkg={ navigation.pkg }
                    className={ pathCn('item') }
                />
            )
        })
    }
}
