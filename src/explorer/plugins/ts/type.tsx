import * as React from 'react';

import {
    TypeReflection,
    isTypeReferenceReflection,
} from 'docscript/src/doc/ast/type';

import TypeRef from './type-ref';
import TypeCore from './type-core';

export interface TypeProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    type: TypeReflection;
}

export default class Type extends React.Component<TypeProps, void> {
    render() {
        let type = this.props.type;
        if (isTypeReferenceReflection(type)) {
            return <TypeRef { ...this.props } typeRef={ type } />;
        } else if (type.coreType) {
            return <TypeCore {...this.props } coreType={ type.coreType as any as string }/>;
        }
    }
}
