import * as React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';

export interface AppLayoutProps extends React.HTMLAttributes {
    menu: any
}

export class AppLayoutComponent extends React.Component<AppLayoutProps, void> {
    static contextTypes: {[key: string]: React.Validator<any>} = {
        muiTheme: React.PropTypes.object,
        service: React.PropTypes.object
    };

    getStyle() {
        return {
            root: {
                display: 'flex',
            },
            menu: {
                maxWidth: '250px',
                flex: '0 0 auto',
                paddingTop: '80px'
            },
            content: {
                flex: '1 1 auto'
            }
        }
    }

    render() {
        let style = this.getStyle();
        return dom.div({
            style: style.root
        },
            dom.div({ style: style.menu }, this.props.menu),
            dom.div({ style: style.content }, this.props.content)
        )
    }
}

export var AppLayout = React.createFactory<AppLayoutProps>(AppLayoutComponent);