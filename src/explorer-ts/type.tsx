import * as React from 'react';

import {
    TypeReflection,
    isTypeReferenceReflection,
    isCoreTypeReferenceReflection,
    isFunctionTypeReflection,
    isUnionTypeReflection,
    isIntersectionTypeReflection,
} from '../doc/ast/type';

import TypeRef from './type-ref';
import TypeCore from './type-core';
import FunctionType from './function-type';
import UnionType from './union-type';
import IntersectionType from './intersection-type';

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
        }
    }
}
