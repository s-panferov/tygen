import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps } from '../../redux';

require('./index.css');
const block = theme.block('paper');

import { Route } from '../../state';

interface PaperReduxProps extends DispatchProps {
    route?: Route;
}

export interface PaperProps extends PaperReduxProps, React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    id?: string;
}

export interface PaperState {
}

@connect(({ route }) => { return { route } as PaperReduxProps; })
export default class Paper extends React.Component<PaperProps, PaperState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this), {
            active: this.props.route.id &&
                this.props.route.id === this.props.id
        }).mix(this.props.className);
    }

    render() {
        return (
            <div
                { ...this.props.htmlProps }
                id={ this.props.id }
                className={ this.getClassName() }
            >
                { this.props.children }
            </div>
        );
    }
}
