import * as React from 'react';
import * as theme from '../../explorer/components/theme';

import SmartLink from '../../explorer/components/smart-link';

require('./index.css');
const block = theme.block('ts-list-section');

export interface ListSectionProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    itemType: string;
    items: [string, string][];
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
                        let [id, name] = item;
                        return <SmartLink key={ id } className={ block('item') } id={ id }>
                            { name }
                        </SmartLink>;
                    })
                }
            </div>
        );
    }
}
