import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps, actions } from '../../redux';
import autobind from '../../../lib/autobind';

require('./index.css');
const block = theme.block('smart-link');

import Link, { LinkProps } from '../link';
import { Route } from '../../state';

export interface SmartLinkProps extends LinkProps, DispatchProps {
    route: Route;
}

export interface SmartLinkState {}

@connect((state) => { return {}; })
export default class SmartLink extends React.Component<SmartLinkProps, SmartLinkState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let htmlProps = Object.assign({}, this.props.htmlProps, {
            onClick: this.onClick
        });

        return (
            <Link
                { ...this.props }
                { ... { htmlProps } }
                className={ this.getClassName() }
            />
        );
    }

    @autobind
    onClick() {
        this.props.dispatch(
            actions.navigate(this.props.route)
        );
    }
}
