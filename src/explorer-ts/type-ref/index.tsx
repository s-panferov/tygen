import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypeReferenceReflection,
    isTypeReferenceReflection,
} from '../../doc/ast/type/type-reference';

import SmartLink from '../../explorer/components/smart-link';
import Paper from '../../explorer/components/paper';
import TypeArguments from '../type-arguments';

require('./index.css');
const block = theme.block('ts-type-ref');

export interface TypeRefProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    typeRef: TypeReferenceReflection;
}

export interface TypeRefState {}

export default class TypeRef extends React.Component<TypeRefProps, TypeRefState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let typeRef = this.props.typeRef;
        let targetType = typeRef.targetType;
        let ref: typeof typeRef.ref = null;
        if (targetType && isTypeReferenceReflection(targetType)) {
            ref = targetType.ref;
        } else {
            ref = typeRef.ref;
        }

        let route = ref;
        if (!route.id) {
            console.error('id expected', typeRef);
        }

        return (
            <Paper className={ this.getClassName() }>
                <SmartLink route={ route }>{ typeRef.typeName }</SmartLink>
                { typeRef.typeArguments &&
                    <TypeArguments typeArguments={ typeRef.typeArguments }/> }
            </Paper>
        );
    }
}
