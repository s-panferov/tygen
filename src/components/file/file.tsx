import React from 'react';
import block from 'bem-cn';

import { Link } from '../link/link';

let navCn = block('file');
require('./file.css');

export interface FileProps extends React.CommonAttributes {
    pkg: string;
    name: string;
    path: string;

    pseudo?: boolean;
    folder?: boolean;
}

export interface FileState {}

export class File extends React.Component<FileProps, FileState> {
    render() {
        let className = navCn(
            {
                folder: this.props.folder,
                pseudo: this.props.pseudo
            }
        ).mix(this.props.className);

        return <Link href="#" className={ className }>
            { this.props.name }
        </Link>
    }
}
