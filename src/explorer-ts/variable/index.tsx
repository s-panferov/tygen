import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    VariableDeclarationReflection,
} from '../../doc/ast/var';

import Heading from '../../explorer/components/heading';
import Paper from '../../explorer/components/paper';

require('./index.css');
const block = theme.block('ts-variable');

export interface VariableProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: VariableDeclarationReflection;
}

export interface VariableState {}

export default class Variable<P extends VariableProps> extends React.Component<P, VariableState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    getHeader() {
        return 'Variable';
    }

    render() {
        let en = this.props.item;
        return (
            <Paper id={ en.id } className={ this.getClassName() }>
                <Heading lvl={ 2 }>
                    { this.getHeader() }
                    { en.name }
                </Heading>
            </Paper>
        );
    }
}
