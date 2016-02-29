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
    route?: Route;
    id?: string;

    render?: (route: Route, linkProps: React.HTMLAttributes) => React.ReactElement<any>;
}

export interface SmartLinkState {}

@connect(({ service }) => { return { service } as SmartLinkReduxProps; })
export default class SmartLink extends React.Component<SmartLinkProps, SmartLinkState> {
    static contextTypes = theme.themeContext;

    finalRoute: Route;

    shouldComponentUpdate(nextProps: SmartLinkProps) {
        if (this.props.route !== nextProps.route
            || this.props.id !== nextProps.id) {
            return true;
        } else {
            return false;
        }
    }

    componentWillMount() {
        this.finalRoute = this.props.service.getFullRoute(
            this.props.route || { id: this.props.id }
        );
    }

    componentWillUpdate() {
        this.finalRoute = this.props.service.getFullRoute(
            this.props.route || { id: this.props.id }
        );
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let htmlProps = Object.assign({}, this.props.htmlProps, {
            onClick: this.onClick,
            href: pathFromRoute(this.finalRoute)
        });

        if (this.props.render) {
            return this.props.render(this.finalRoute, htmlProps);
        } else {
            return (
                <Link
                    { ...this.props }
                    { ... { htmlProps } }
                    className={ this.getClassName() }
                />
            );
        }
    }

    @autobind
    onClick(e: React.MouseEvent) {
        e.preventDefault();

        this.props.dispatch(
            actions.navigate(this.finalRoute)
        );
    }
}
