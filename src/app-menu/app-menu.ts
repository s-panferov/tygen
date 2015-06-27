import * as React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';

var Menu = React.createFactory(mui.Menu);
var Tabs = React.createFactory(mui.Tabs);
var Tab = React.createFactory(mui.Tab);

export interface AppMenuProps extends React.HTMLAttributes {
    menuItems: any
}


export class AppMenuComponent extends React.Component<AppMenuProps, void> {
    static contextTypes: {[key: string]: React.Validator<any>} = {
        muiTheme: React.PropTypes.object,
        service: React.PropTypes.object
    };

    render() {
        return dom.div(null,
            Tabs(null, [
                Tab({ label: 'Files' }),
                Tab({ label: 'Modules' })
            ]),
            Menu({
                menuItems: this.props.menuItems
            })
        )
    }
}

export var AppMenu = React.createFactory<AppMenuProps>(AppMenuComponent);