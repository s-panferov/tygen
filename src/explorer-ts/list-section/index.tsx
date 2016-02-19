import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import { Item } from '../../doc/items';
import SmartLink from '../../explorer/components/smart-link';

require('./index.css');
const block = theme.block('ts-list-section');

export interface ListSectionProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    itemType: string;
    items: Item[];
}

export interface ListSectionState {}

export default class ListSection extends React.Component<ListSectionProps, ListSectionState> {
    static contextTypes = theme.themeContext;

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ block() }>
                <div className={ block('heading') }>
                    { this.props.itemType }
                </div>
                {
                    this.props.items.map(item => {
                        return <SmartLink key={ item.id } className={ block('item') } id={ item.id }>
                            { item.name }
                        </SmartLink>;
                    })
                }
            </div>
        );
    }
}
