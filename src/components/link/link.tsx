import React from 'react';
import block from 'bem-cn';
import { omit } from 'lodash';

let navCn = block('link');
require('./link.css');

export interface LinkProps extends React.HTMLAttributes {}

export interface LinkState {}

export class Link extends React.Component<LinkProps, LinkState> {
    render() {
        let className = navCn().mix(this.props.className);
        return <a { ...this.props } className={ className }>
            { this.props.children }
        </a>
    }
}
