import React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';

export interface LayoutProps extends React.DOMAttributes {
    menu: any
}

export class LayoutComponent extends React.Component<LayoutProps, void> {
    props: LayoutProps;

    getStyle() {
        return {
            root: {
                display: 'flex',
            },
            menu: {
                maxWidth: '250px',
                flex: '0 0 auto',
                paddingTop: '64px'
            },
            content: {
                flex: '1 1 auto'
            }
        }
    }

    render() {
        let style = this.getStyle();
        return dom.div(
            {
                style: style.root
            },
            dom.div({ style: style.menu }, this.props.menu),
            dom.div({ style: style.content }, this.props.children)
        )
    }
}

export var Layout = React.createFactory<LayoutProps>(LayoutComponent);
