import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { ModuleInfo, Ref } from '../../doc';
import ListSection, { ListSectionView } from '../list-section';

require('./index.css');
const block = theme.block('ts-list');

export enum ListView {
    Sidebar = 'sidebar' as any,
    Reference = 'reference' as any
};

export interface ListProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    showOnlyExported?: boolean;
    module: ModuleInfo;
    view?: ListView;
}

export interface ListState {}

export default class List extends React.Component<ListProps, ListState> {
    static contextTypes = theme.themeContext;
    static defaultProps = {
        view: ListView.Sidebar,
        showOnlyExported: false
    };

    shouldComponentUpdate(nextProps: ListProps) {
        return this.props.module !== nextProps.module
            || this.props.showOnlyExported !== nextProps.showOnlyExported;
    }

    getClassName() {
        return block(theme.resolveTheme(this), {
            view: this.props.view
        }).mix(this.props.className);
    }

    render() {
        return (
            <div {...this.props.htmlProps} className={ this.getClassName() } >
                {
                    this.renderItems()
                }
            </div>
        );
    }

    renderItems() {
        let items = this.props.module.items;
        let itemsIndex = this.props.module.itemsIndex;
        let showOnlyExported = this.props.showOnlyExported;

        if (itemsIndex) {
            items = Object.keys(itemsIndex).map(id => {
                let i = itemsIndex[id];
                return [i.selfRef, i.itemType, i.name, (i as any).exported] as any;
            });
        }

        let groups = {} as {[itemType: string]: [Ref, string][]};
        items.forEach(([selfRef, itemType, name, exported]) => {
            if (showOnlyExported && !exported) { return; }
            if (!groups[itemType]) { groups[itemType] = []; }
            groups[itemType].push([selfRef, name, exported]);
        });

        let view = this.props.view === ListView.Reference
            ? ListSectionView.Row
            : ListSectionView.Column;

        let sections = Object.keys(groups).map(itemType => {
            let items = groups[itemType];
            return (
                <ListSection
                    key={ itemType }
                    view={ view }
                    itemType={ itemType }
                    items={ items }
                />
            );
        });

        return sections;
    }
}
