import * as React from 'react';

import {
    TypeReflection,
    isTypeReferenceReflection,
    isCoreTypeReferenceReflection
} from '../../../doc/ast/type';

import TypeRef from './type-ref';
import TypeCore from './type-core';

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
        }
    }
}
