import * as React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';

var { MenuItem } = mui;

var AppCanvas = React.createFactory(mui.AppCanvas);
var AppBar = React.createFactory(mui.AppBar);
var LeftNav = React.createFactory(mui.LeftNav);

const ThemeManager = new mui.Styles.ThemeManager();

const menuItems = [
    { type: MenuItem.Types.SUBHEADER, text: 'Packages' },
    {
        text: 'alfa-react-ui',
    }
];

export interface PageProps extends React.HTMLAttributes { }
export class PageComponent extends React.Component<PageProps, void> {
    static childContextTypes: {[key: string]: React.Validator<any>} = {
        muiTheme: React.PropTypes.object
    };

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    refs: {
        [key: string]: React.Component<any, any>;
        leftNav: any
    };

    render() {
        return AppCanvas(null, [
            AppBar({
                title: "alfa-react-ui",
                onLeftIconButtonTouchTap: this.onLeftIconButtonTouchTap.bind(this)
            }),
            LeftNav({
                ref: 'leftNav',
                menuItems,
                docked: false,
                isInitiallyOpen: false
            })
        ])
    }

    onLeftIconButtonTouchTap() {
        this.refs.leftNav.toggle()
    }
}

export var Page = React.createFactory<PageProps>(PageComponent);