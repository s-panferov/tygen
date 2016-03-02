import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypePredicateReflection,
} from '../../doc/ast/type/type-predicate';

import Type from '../type';

require('./index.css');
const block = theme.block('ts-type-predicate');

export interface TypePredicateProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    predicate: TypePredicateReflection;
}

export interface TypePredicateState {}

export default class TypePredicate extends React.Component<TypePredicateProps, TypePredicateState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let predicate = this.props.predicate;
        return (
            <span className={ this.getClassName() }>
                { predicate.parameterName }
                is
                <Type type={ predicate.type } />
            </span>
        );
    }
}
