import * as React from 'react';
import * as theme from '../../../components/theme';

import {
    TypeReferenceReflection,
    isTypeReferenceReflection,
} from '../../../../doc/ast/type';

import SmartLink from '../../../components/smart-link';
import Paper from '../../../components/paper';
import Brackets from '../brackets';

import Type from '../type';

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
        let ref: string = null;
        if (targetType && isTypeReferenceReflection(targetType)) {
            ref = targetType.ref;
        } else {
            ref = typeRef.ref;
        }

        let route = { id: ref };
        if (!route.id) {
            console.error('id expected', typeRef);
        }

        return (
            <Paper className={ this.getClassName() }>
                <SmartLink route={ route }>{ typeRef.typeName }</SmartLink>
                { this.renderTypeArguments() }
            </Paper>
        );
    }

    renderTypeArguments(): React.ReactChild {
        let typeArguments = this.props.typeRef.typeArguments;
        if (!typeArguments) {
            return null;
        }

        let result: React.ReactChild[] = [];

        typeArguments.forEach((typeArg, i) => {
            result.push(<Type type={ typeArg } />);
            if (i < typeArguments.length - 1) {
                result.push(', ');
            }
        });

        return <Brackets>{ result }</Brackets>;
    }
}
