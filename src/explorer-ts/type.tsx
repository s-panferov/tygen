import * as React from 'react';

import {
    TypeReflection,
    isTypeReferenceReflection,
    isCoreTypeReferenceReflection,
    isFunctionTypeReflection,
    isUnionTypeReflection,
    isIntersectionTypeReflection,
    isArrayTypeReflection,
    isStringLiteralTypeReflection,
    isTupleTypeReflection,
    isConstructorTypeReflection,
    isTypePredicateReflection,
    isTypeLiteralReflection,
    isParenthesizedTypeReflection
} from '../doc/ast/type';

import TypeRef from './type-ref';
import TypeCore from './type-core';
import FunctionType from './function-type';
import UnionType from './union-type';
import IntersectionType from './intersection-type';
import StringLiteralType from './string-literal-type';
import ArrayType from './array-type';
import TupleType from './tuple-type';
import ConstructorType from './constructor-type';
import TypePredicate from './type-predicate';
import TypeLiteral from './type-literal';
import ParenthesizedType from './parenthesized-type';

export interface TypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: TypeReflection;
}

export default class Type extends React.Component<TypeProps, void> {
    render() {
        let type = this.props.type;
        if (isCoreTypeReferenceReflection(type)) {
            return <TypeCore {...this.props } coreType={ type.coreType as any as string }/>;
        } else if (isTypeReferenceReflection(type)) {
            return <TypeRef { ...this.props } typeRef={ type } />;
        } else if (isFunctionTypeReflection(type)) {
            return <FunctionType { ...this.props } foo={ type } />;
        } else if (isUnionTypeReflection(type)) {
            return <UnionType { ...this.props } type={ type } />;
        } else if (isIntersectionTypeReflection(type)) {
            return <IntersectionType { ...this.props } type={ type } />;
        } else if (isStringLiteralTypeReflection(type)) {
            return <StringLiteralType { ...this.props } type={ type } />;
        } else if (isArrayTypeReflection(type)) {
            return <ArrayType { ...this.props } type={ type } />;
        } else if (isTupleTypeReflection(type)) {
            return <TupleType { ...this.props } type={ type } />;
        } else if (isConstructorTypeReflection(type)) {
            return <ConstructorType { ...this.props } type={ type } />;
        } else if (isTypePredicateReflection(type)) {
            return <TypePredicate { ...this.props } predicate={ type } />;
        } else if (isTypeLiteralReflection(type)) {
            return <TypeLiteral { ...this.props } type={ type } />;
        } else if (isParenthesizedTypeReflection(type)) {
            return <ParenthesizedType { ...this.props } type={ type } />;
        } else {
            return <div>
                Unknown type
                { JSON.stringify(type) }
            </div>;
        }
    }
}
