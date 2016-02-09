import * as React from 'react';
import * as theme from 'docscript/src/explorer/components/theme';

import Layout from 'docscript/src/explorer/components/layout';
import Heading from 'docscript/src/explorer/components/heading';
import { Module as ModuleRef } from 'docscript/src/doc';
import { isInterfaceReflection } from 'docscript/src/doc/ast/interface';

import List from '../list';
import Interface from '../interface';

require('./index.css');
const block = theme.block('ts-module');

export interface ModuleProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    module: ModuleRef;
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
                        { this.renderItems() }
                    </div>
                </Layout>
            </div>
        );
    }

    renderItems() {
        let items = this.props.module.items;
        return items.map(item => {
            if (isInterfaceReflection(item)) {
                return (
                    <Interface
                        iface={ item }
                    />
                );
            }
        });
    }
}
