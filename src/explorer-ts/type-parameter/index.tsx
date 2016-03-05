import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypeParameterReflection,
} from '../../doc/ast/type/type-parameter';
import {
    isTypeReferenceReflection,
} from '../../doc/ast/type/type-reference';
import {
    isExpressionWithTypeArgumentsReflection,
} from '../../doc/ast/type/expression';

import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';

import TypeExpression from '../type-expression';
import TypeRef from '../type-ref';

require('./index.css');
const block = theme.block('ts-type-parameter');

export interface TypeParameterProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    typeParam: TypeParameterReflection;
    asConstraint?: boolean;
}

export interface TypeParameterState {}

export default class TypeParameter extends React.Component<TypeParameterProps, TypeParameterState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let typeParam = this.props.typeParam;
        let route = { id: typeParam.id };

        return (
            <Paper id={ typeParam.id} className={ this.getClassName() }>
                <SmartLink key='link' route={ route }>{ typeParam.name }</SmartLink>
                { this.props.asConstraint && typeParam.constraint &&
                    this.renderConstraint() }
            </Paper>
        );
    }

    renderConstraint() {
        let constraint = this.props.typeParam.constraint;
        let view: React.ReactNode;

        if (isTypeReferenceReflection(constraint)) {
            view = <TypeRef key='ref' typeRef={ constraint } />;
        } else if (isExpressionWithTypeArgumentsReflection(constraint)) {
            view = <TypeExpression key='expr' expr={ constraint } />;
        } else {
            view = null;
        }

        return [
            <span key='extends'> extends </span>,
            view
        ];
    }
}
