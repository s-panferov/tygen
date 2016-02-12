import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypeParameterReflection,
    isTypeReferenceReflection,
    isExpressionWithTypeArgumentsReflection
} from '../../doc/ast/type';

import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';

import TypeExpression from '../type-expression';
import TypeRef from '../type-ref';

require('./index.css');
const block = theme.block('ts-type-parameter');

export interface TypeParameterProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    typeParam: TypeParameterReflection;
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
                <SmartLink route={ route }>{ typeParam.name }</SmartLink>
                { typeParam.constraint &&
                    this.renderConstraint() }
            </Paper>
        );
    }

    renderConstraint() {
        let constraint = this.props.typeParam.constraint;
        let view: React.ReactNode;

        if (isTypeReferenceReflection(constraint)) {
            view = <TypeRef typeRef={ constraint } />;
        } else if (isExpressionWithTypeArgumentsReflection(constraint)) {
            view = <TypeExpression expr={ constraint } />;
        } else {
            view = null;
        }

        return [
            'extends',
            view
        ];
    }
}
