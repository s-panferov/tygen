import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    StringLiteralTypeReflection
} from '../../doc/ast/type';

require('./index.css');
const block = theme.block('ts-string-literal-type');

export interface StringLiteralTypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: StringLiteralTypeReflection;
}

export interface StringLiteralTypeState {}

export default class StringLiteralType extends React.Component<StringLiteralTypeProps, StringLiteralTypeState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <span className={ this.getClassName() }>"{ this.props.type.text }"</span>
        );
    }
}
