import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import Layout from '../../explorer/components/layout';
import Heading from '../../explorer/components/heading';
import { Route } from '../../explorer/service';
import { Item } from '../../doc/items';
import { ModuleInfo } from '../../doc';
import { isInterfaceReflection } from '../../doc/ast/interface';
import { isClassReflection } from '../../doc/ast/class';
import { isFunctionReflection } from '../../doc/ast/function';
import { isEnumDeclarationReflection } from '../../doc/ast/enum';
import { isVariableDeclarationReflection } from '../../doc/ast/var';
import { isTypeAliasDeclarationReflection } from '../../doc/ast/type-alias';

import List from '../list';
import Interface from '../interface';
import Class from '../class';
import Function from '../function';
import Enum from '../enum';
import Variable from '../variable';
import TypeAlias from '../type-alias';

require('./index.css');
const block = theme.block('ts-module');

export interface ModuleProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    module: ModuleInfo;
    item: Item;
    route: Route;
}

export interface ModuleState {}

export default class Module extends React.Component<ModuleProps, ModuleState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <Layout
                    className={ block('layout') }
                    reverse={ true }
                    sidebar={
                        <List module={ this.props.module }/>
                    }
                >
                    <div>
                        <Heading>
                            Module { this.props.module.fileInfo.relativeToPackage }
                        </Heading>
                        { this.renderContent() }
                    </div>
                </Layout>
            </div>
        );
    }

    renderContent() {
        if (this.props.item) {
            return this.renderItem(this.props.item);
        }
    }

    renderItem(item: Item) {
        if (isInterfaceReflection(item)) {
            return (
                <Interface
                    key={ item.id }
                    item={ item }
                />
            );
        } else if (isClassReflection(item)) {
            return (
                <Class
                    key={ item.id }
                    item={ item }
                />
            );
        } else if (isFunctionReflection(item)) {
            return (
                <Function
                    key={ item.id }
                    item={ item }
                />
            );
        } else if (isEnumDeclarationReflection(item)) {
            return (
                <Enum
                    key={ item.id }
                    item={ item }
                />
            );
        } else if (isVariableDeclarationReflection(item)) {
            return (
                <Variable
                    key={ item.id }
                    item={ item }
                />
            );
        } else if (isTypeAliasDeclarationReflection(item)) {
            return (
                <TypeAlias
                    key={ item.id }
                    item={ item }
                />
            );
        } else {
            return <div>
                Unknown item
                { JSON.stringify(item) }
            </div>;
        }
    }
}
