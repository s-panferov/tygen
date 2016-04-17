import * as React from 'react';

import {
    TypeReflection,
    isCoreTypeReferenceReflection,
} from '../doc/ast/type';

import {
    isUnionTypeReflection,
    isIntersectionTypeReflection
} from '../doc/ast/type/intersection-union';

import { isTypeReferenceReflection } from '../doc/ast/type/type-reference';
import { isFunctionTypeReflection } from '../doc/ast/type/signature';
import { isArrayTypeReflection } from '../doc/ast/type/array';
import { isStringLiteralTypeReflection } from '../doc/ast/type/string-literal';
import { isTupleTypeReflection } from '../doc/ast/type/tuple';
import { isConstructorTypeReflection } from '../doc/ast/type/signature';
import { isTypeLiteralReflection } from '../doc/ast/type/type-literal';
import { isTypePredicateReflection } from '../doc/ast/type/type-predicate';
import { isParenthesizedTypeReflection } from '../doc/ast/type/parenthesized';
import { isTypeQueryReflection } from '../doc/ast/type/type-query';

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
import TypeQuery from './type-query';

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
        } else if (isTypeQueryReflection(type)) {
            return <TypeQuery { ...this.props } type={ type } />;
        } else {
            return <div>
                Unknown type
                { JSON.stringify(type) }
            </div>;
        }
    }
}
