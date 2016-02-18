import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypeLiteralReflection,
} from '../../doc/ast/type';

import Paper from '../../explorer/components/paper';
import TypeMembers from '../type-members';
import Brackets, { BracketsType } from '../brackets';

require('./index.css');
const block = theme.block('ts-type-literal');

export interface TypeLiteralProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: TypeLiteralReflection;
}

export interface TypeLiteralState {}

export default class TypeLiteral<P extends TypeLiteralProps> extends React.Component<P, TypeLiteralState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let type = this.props.type;
        return (
            <Paper className={ this.getClassName() }>
                <Brackets type={ BracketsType.Curly }>
                    { type.members &&
                        <TypeMembers members={ type.members } /> }
                </Brackets>
            </Paper>
        );
    }
}
