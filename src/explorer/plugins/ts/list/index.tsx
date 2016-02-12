import * as React from 'react';
import * as theme from '../../../components/theme';

import { Module as ModuleRef } from '../../../../doc';
import { Item } from '../../../../doc/items';
import {
    isInterfaceReflection,
    InterfaceReflection
} from '../../../../doc/ast/interface';

import Link from '../../../components/link';

require('./index.css');
const block = theme.block('ts-list');

export interface ListProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    module: ModuleRef;
}

export interface ListState {}

export default class List extends React.Component<ListProps, ListState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                {
                    this.renderItems()
                }
            </div>
        );
    }

    renderItems() {
        let items = this.props.module.items;
        let interfaces: InterfaceReflection[] = [];
        items.forEach(item => {
            if (isInterfaceReflection(item)) {
                interfaces.push(item);
            }
        });

        let sections = [];
        sections.push(
            <div className={ block('section') }>
                <div className={ block('heading') }>
                    Interfaces
                </div>
                {
                    interfaces.map(iface => {
                        return <Link className={ block('item') }>
                            { iface.name }
                        </Link>;
                    })
                }
            </div>
        );

        return sections;
    }
}
