import React from 'react';
import * as block from 'bem-cn';

export interface LayoutProps extends React.DOMAttributes {
    menu: any
}

let layoutCn = block('layout');

export class Layout extends React.Component<LayoutProps, void> {
    render() {
        <div className={ layoutCn() }>
            <div className={ layoutCn('menu') }>{ this.props.menu }</div>
            <div className={ layoutCn('content') }>{ this.props.content }</div>
        </div>
    }
}
