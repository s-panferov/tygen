import * as React from 'react';
import * as theme from '../../explorer/components/theme';
import Figure from '../../explorer/components/figure';
import Heading from '../../explorer/components/heading';
import Paper from '../../explorer/components/paper';

import {
    TypeAliasDeclarationReflection
} from '../../doc/ast/type-alias';

import TypeParameters from '../type-parameters';
import Type from '../type';
import Comment from '../comment';

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
            <Paper id={ alias.selfRef.id } className={ this.getClassName() } highlight={ false }>
                <Heading lvl={ 1 }>
                    { 'Type ' }
                    { alias.name }
                </Heading>
                {
                    alias.comment &&
                        <Comment comment={ alias.comment } />
                }
                <Figure>
                    <span key='keyword'>type </span>
                    <span key='name'>{ alias.name }</span>
                    { alias.typeParameters &&
                        <TypeParameters typeParameters={ alias.typeParameters } />
                    }
                    <span key='eq'> = </span>
                    <Type type={alias.type} />
                </Figure>
            </Paper>
        );
    }
}
