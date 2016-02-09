import * as React from 'react';
import * as theme from '../theme';

require('./index.css');
const block = theme.block('paper');

export interface PaperProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
}
export interface PaperState {}

export default class Paper extends React.Component<PaperProps, PaperState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div
                { ...this.props.htmlProps }
                className={ this.getClassName() }
            >
                { this.props.children }
            </div>
        );
    }
}
