import * as React from 'react';
import * as theme from '../theme';

import Link from '../link';
import { Route } from '../../state';

let block = theme.block('file');
require('./index.css');

export interface FileProps extends React.CommonProps {
    pkg: string;
    name: string;
    path: string;

    pseudo?: boolean;
    folder?: boolean;
    disabled?: boolean;
    active?: boolean;

    navigate: (nav: Route) => void;
}

export interface FileState {}

export default class File extends React.Component<FileProps, FileState> {
    constructor(props, context) {
        super(props, context);
        this.onClick = this.onClick.bind(this);
    }
    render() {
        let className = block(
            {
                folder: this.props.folder,
                pseudo: this.props.pseudo,
                active: this.props.active
            }
        ).mix(this.props.className);

        if (!this.props.disabled && !this.props.active) {
            return (
                <Link
                    htmlProps={{
                        href: '#',
                        onClick: this.onClick
                    }}
                    className={ className }
                >
                    { this.props.name }
                </Link>
            );
        } else {
            return (
                <div className={ className }>
                    { this.props.name }
                </div>
            );
        }
    }

    onClick() {
        let { pkg, path } = this.props;
        this.props.navigate({ pkg, path });
    }
}
