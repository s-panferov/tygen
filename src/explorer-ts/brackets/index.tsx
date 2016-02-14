import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import autobind from '../../lib/autobind';

require('./index.css');
const block = theme.block('ts-brackets');

export interface BracketsProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
}

export interface BracketsState {
    hover: boolean;
}

export default class Brackets extends React.Component<BracketsProps, BracketsState> {
    static contextTypes = theme.themeContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            hover: false
        };
    }

    getClassName() {
        return block(theme.resolveTheme(this))
            .mix(this.props.className);
    }

    render() {
        let bracketProps = {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
            className: block('bracket', {
                hover: this.state.hover
            })
        };
        return (
            <span className={ this.props.className }>
                <span key='left' { ...bracketProps }>{ '<' }</span>
                { this.props.children }
                <span key='right' { ...bracketProps }>{ '>' }</span>
            </span>
        );
    }

    @autobind
    onMouseEnter() {
        this.setState({
            hover: true
        });
    }

    @autobind
    onMouseLeave() {
        this.setState({
            hover: false
        });
    }
}
