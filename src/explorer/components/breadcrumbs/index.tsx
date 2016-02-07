import * as React from 'react';
import * as theme from '../theme';

export interface BreadcrumbsProps extends React.CommonProps {
    separator?: React.ReactNode;
}

export interface BreadcrumbsState { }

require('./index.css');

let block = theme.block('breadcrumbs');

const SEPARATOR = <span className={ block('sep') }>/</span>;

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, BreadcrumbsState> {
    static defaultProps = {
        separator: SEPARATOR
    };

    joinChildren() {
        let resultChildren: React.ReactNode[] = [];
        let maxIdx = React.Children.count(this.props.children) - 1;

        React.Children.forEach(this.props.children, (child, idx) => {
            resultChildren.push(child);
            if (idx < maxIdx) {
                resultChildren.push(this.props.separator);
            }
        });

        return resultChildren;
    }

    render() {
        return (
            <div>{ this.joinChildren() }</div>
        );
    }
}
