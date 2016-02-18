import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import {
    TypeAliasDeclarationReflection
} from '../../doc/ast/type-alias';

import TypeParameters from '../type-parameters';
import Type from '../type';

require('./index.css');
const block = theme.block('ts-type-alias');

export interface TypeAliasProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    item: TypeAliasDeclarationReflection;
}

export interface TypeAliasState {}

export default class TypeAlias extends React.Component<TypeAliasProps, TypeAliasState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        let alias = this.props.item;
        return (
            <div className={ this.getClassName() }>
                type
                { alias.name }
                { alias.typeParameters &&
                    <TypeParameters typeParameters={ alias.typeParameters } />
                }
                =
                <Type type={alias.type} />
            </div>
        );
    }
}
