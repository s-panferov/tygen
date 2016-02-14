import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    ExpressionWithTypeArgumentsReflection,
    isTypeReferenceReflection
} from '../../doc/ast/type';

import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';
import TypeArguments from '../type-arguments';

require('./index.css');
const block = theme.block('ts-type-ref');

export interface TypeExpressionProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    expr: ExpressionWithTypeArgumentsReflection;
}

export interface TypeExpressionState {}

export default class TypeExpression extends React.Component<TypeExpressionProps, TypeExpressionState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let expr = this.props.expr;

        return (
            <Paper className={ this.getClassName() }>
                { this.renderType() }
                { expr.typeArguments &&
                    <TypeArguments typeArguments={ expr.typeArguments }/> }
            </Paper>
        );
    }

    renderType() {
        let expression = this.props.expr.expression;
        let type = expression.type;
        if (isTypeReferenceReflection(type)) {
            return (
                <SmartLink id={ type.ref }>
                    { expression.name }
                </SmartLink>
            );
        } else {
            return <span>TODO</span>;
        }
    }
}
