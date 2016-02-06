import * as React from 'react';
import * as theme from '../theme';

require('./index.css');
const block = theme.block('link');

export interface LinkProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
}
export interface LinkState {}

export default class Link extends React.Component<LinkProps, LinkState> {
    getClassName() {
        return block().mix(this.props.className);
    }

    render() {
        return (
            <a
                { ...this.props.htmlProps }
                className={ this.getClassName() }
            >
                { this.props.children }
            </a>
        );
    }
}
