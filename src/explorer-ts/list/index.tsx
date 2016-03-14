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
    module: ModuleInfo;
    view?: ListView;
}

export interface ListState {}

export default class List extends React.Component<ListProps, ListState> {
    static contextTypes = theme.themeContext;
    static defaultProps = {
        view: ListView.Sidebar
    };

    getClassName() {
        return block(theme.resolveTheme(this), {
            view: this.props.view
        }).mix(this.props.className);
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

        let groups = {} as {[itemType: string]: [Ref, string][]};
        items.forEach(([selfRef, itemType, name]) => {
            if (!groups[itemType]) { groups[itemType] = []; }
            groups[itemType].push([selfRef, name]);
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
