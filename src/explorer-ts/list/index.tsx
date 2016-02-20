import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { ModuleInfo } from '../../doc';
import { Item } from '../../doc/items';
import ListSection from '../list-section';

require('./index.css');
const block = theme.block('ts-list');

export interface ListProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    module: ModuleInfo;
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

        let groups = {} as {[itemType: string]: [string, string][]};
        items.forEach(([id, itemType, name]) => {
            if (!groups[itemType]) { groups[itemType] = []; }
            groups[itemType].push([id, name]);
        });

        let sections = Object.keys(groups).map(itemType => {
            let items = groups[itemType];
            return (
                <ListSection key={ itemType } itemType={ itemType } items={ items } />
            );
        });

        return sections;
    }
}
