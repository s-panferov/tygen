import * as React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';

import { Service } from '../service';
import { AppLayout } from '../app-layout/app-layout';
import { AppMenu } from '../app-menu/app-menu';

var { MenuItem } = mui;
import { IPkgMap } from '../service';
import { IDoc, IDocMap } from 'awesome-typescript-loader/src/doc/doc';

var AppCanvas = React.createFactory(mui.AppCanvas);
var AppBar = React.createFactory(mui.AppBar);
var LeftNav = React.createFactory(mui.LeftNav);

const ThemeManager = new mui.Styles.ThemeManager();

const menuItems = [
    {
        text: 'alfa-react-ui',
    }
];

export interface PageProps extends React.HTMLAttributes {
    service: Service
}

export interface PageState extends React.HTMLAttributes {
    pkg: string
}

export class PageComponent extends React.Component<PageProps, PageState> {
    constructor(props: PageProps, context) {
        super(props, context);

        this.state = {
            pkg: props.service.getMainPackageName()
        }
    }

    static childContextTypes: {[key: string]: React.Validator<any>} = {
        muiTheme: React.PropTypes.object,
        service: React.PropTypes.object
    };

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
            service: this.props.service
        };
    }

    refs: {
        [key: string]: React.Component<any, any>;
        leftNav: any
    };

    render() {
        let { service } = this.props;
        let packages = service.getPackages();
        let pkg = service.getPackage(this.state.pkg);

        return AppCanvas(null, [
            AppBar({
                title: pkg.info.name,
                onLeftIconButtonTouchTap: this.onLeftIconButtonTouchTap.bind(this)
            }),
            LeftNav(
                _.extend(
                    {
                        ref: 'leftNav',
                        docked: false,
                        isInitiallyOpen: false,
                        onChange: (e, idx, menuItem) => this.onPackageChange(menuItem.payload)
                    },
                    renderPackageItems(packages, this.state.pkg)
                )
            ),
            AppLayout({
                menu: AppMenu({
                    menuItems: renderFileItems(pkg.files)
                }),
                content: null
            })
        ])
    }

    onLeftIconButtonTouchTap() {
        this.refs.leftNav.toggle()
    }

    onPackageChange(pkg: string) {
        this.setState({ pkg })
    }
}

function renderFileItems(files: IDocMap) {
    return _.map(files, (_doc: IDoc, fileName: string) => {
        return { payload: fileName, text: fileName }
    });
}

function renderPackageItems(packages: IPkgMap, currentPackage: string) {
    let selectedIndex;
    let i = 0;
    let menuItems = [<any>{ type: MenuItem.Types.SUBHEADER, text: 'Packages' }].concat(
        _.map(packages, (_pkg, key) => {
            i += 1;
            console.log(key, currentPackage, i)
            if (key == currentPackage) {
                selectedIndex = i
            }
            return {
                payload: key,
                text: key,
            }
        })
    );

    return { menuItems, selectedIndex }
}

export var Page = React.createFactory<PageProps>(PageComponent);