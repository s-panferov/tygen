import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps, actions } from '../../redux';
import autobind from '../../../lib/autobind';

require('./index.css');
const block = theme.block('smart-link');

import Link, { LinkProps } from '../link';
import { Route } from '../../state';
import Service from '../../service';

import {
    pathFromRoute
} from '../../index';

interface SmartLinkReduxProps extends DispatchProps {
    service?: Service;
}

export interface SmartLinkProps extends SmartLinkReduxProps, LinkProps, DispatchProps {
    route: Route;
}

export interface SmartLinkState {}

@connect(({ service }) => { return { service } as SmartLinkReduxProps; })
export default class SmartLink extends React.Component<SmartLinkProps, SmartLinkState> {
    static contextTypes = theme.themeContext;

    finalRoute: Route;

    componentWillMount() {
        this.finalRoute = this.props.service.getFullRoute(this.props.route);
    }

    componentWillUpdate() {
        this.finalRoute = this.props.service.getFullRoute(this.props.route);
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let htmlProps = Object.assign({}, this.props.htmlProps, {
            onClick: this.onClick,
            href: pathFromRoute(this.finalRoute)
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
    onClick(e: React.MouseEvent) {
        e.preventDefault();

        this.props.dispatch(
            actions.navigate(this.props.route)
        );
    }
}
