import * as React from 'react';
import * as theme from '../theme';

import Join from '../join';

export interface BreadcrumbsProps extends React.CommonProps {
    separator?: (idx: number) => React.ReactNode;
}

export interface BreadcrumbsState { }

require('./index.css');

let block = theme.block('breadcrumbs');

const SEPARATOR = (key) => <span key={ `sep-${key}` } className={ block('sep') }>/</span>;

export default class Breadcrumbs extends React.Component<BreadcrumbsProps, BreadcrumbsState> {
    static defaultProps = {
        separator: SEPARATOR
    };

    getClassName() {
        return block(
            theme.resolveTheme(this),
            {
            }
        ).mix(this.props.className);
    }

    render() {
        return (
            <Join
                className={ this.getClassName() }
                separator={ this.props.separator }
            >
                { this.props.children }
            </Join>
        );
    }
}
