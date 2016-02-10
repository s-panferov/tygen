import * as React from 'react';
import * as theme from 'docscript/src/explorer/components/theme';

import {
    TypeReferenceReflection,
    isTypeReferenceReflection,
} from 'docscript/src/doc/ast/type';

import Link from 'docscript/src/explorer/components/link';
import Paper from 'docscript/src/explorer/components/paper';

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
        return (
            <Paper className={ this.getClassName() }>
                <Link>{ typeRef.typeName }</Link>
                { this.renderTypeArguments() }
            </Paper>
        );
    }

    renderTypeArguments() {
        let typeArguments = this.props.typeRef.typeArguments;
        if (!typeArguments) {
            return;
        }

        let result: React.ReactNode[] = ['<'];

        typeArguments.forEach((typeArg, i) => {
            result.push(<Type type={ typeArg } />);
            if (i < typeArguments.length - 1) {
                result.push(', ');
            }
        });

        result.push('>');
        return result;
    }
}
