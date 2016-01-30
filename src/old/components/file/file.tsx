import React from 'react';
import block from 'bem-cn';

import { Link } from '../link/link';
import { Navigation } from '../../state';

let navCn = block('file');
require('./file.css');

export interface FileProps extends React.CommonAttributes {
    pkg: string;
    name: string;
    path: string;

    pseudo?: boolean;
    folder?: boolean;
    disabled?: boolean;
    active?: boolean;

    navigate: (nav: Navigation) => void;
}

export interface FileState {}

export class File extends React.Component<FileProps, FileState> {
    constructor(props, context) {
        super(props, context);
        this.onClick = this.onClick.bind(this);
    }
    render() {
        let className = navCn(
            {
                folder: this.props.folder,
                pseudo: this.props.pseudo,
                active: this.props.active
            }
        ).mix(this.props.className);

        if (!this.props.disabled && !this.props.active) {
            return <Link href="#" className={ className } onClick={ this.onClick }>
                { this.props.name }
            </Link>
        } else {
            return <div className={ className }>
                { this.props.name }
            </div>
        }
    }

    onClick() {
        let { pkg, path } = this.props;
        this.props.navigate({ pkg, path });
    }
}
