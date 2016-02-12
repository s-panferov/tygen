import * as React from 'react';
import * as theme from '../../../components/theme';

require('./index.css');
const block = theme.block('ts-brackets');

export interface BracketsProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
}

export interface BracketsState {

}

export default class Brackets extends React.Component<BracketsProps, BracketsState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.props.className }>
                { '<' }{ this.props.children }{ '>' }
            </div>
        );
    }
}
