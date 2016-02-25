import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps } from '../../redux';

require('./index.css');
const block = theme.block('paper');

import Service, { Route } from '../../service';

interface PaperReduxProps extends DispatchProps {
    route?: Route;
    service?: Service;
}

export interface PaperProps extends PaperReduxProps, React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    id?: string;
    block?: boolean;
    highlight?: boolean;
}

export interface PaperState {
}

@connect(({ route, service }) => { return { route, service } as PaperReduxProps; })
export default class Paper extends React.Component<PaperProps, PaperState> {
    static contextTypes = theme.themeContext;
    static defaultProps = {
        highlight: true
    };

    isActive(): boolean {
        if (!this.props.id) {
            return false;
        }

        if (this.props.route.id) {
            return this.props.route.id === this.props.id;
        } else if (this.props.route.semanticId) {
            let fullRoute = this.props.service.getFullRoute({ id: this.props.id });
            if (fullRoute.semanticId) {
                return this.props.route.semanticId == fullRoute.semanticId;
            } else {
                return false;
            }
        }
    }

    getClassName() {
        return block(theme.resolveTheme(this), {
            active: this.props.highlight ? this.isActive() : false,
            block: this.props.block
        }).mix(this.props.className);
    }

    render() {
        return (
            <div
                id={ this.props.id }
                { ...this.props.htmlProps }
                className={ this.getClassName() }
            >
                { this.props.children }
            </div>
        );
    }
}
