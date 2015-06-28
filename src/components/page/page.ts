import * as React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';

import { IDoc, IDocMap } from '../../../../awesome-typescript-loader/src/doc/doc';

import { Service, IPackageMap } from '../../service';
import { IEnv, IState } from '../../index';

import { Layout } from '../layout/layout';
import { Navigator } from '../navigator/navigator';
import { PackageNav } from '../package-nav/package-nav';
import { bindState, unbindState, IMap } from '../component';

var AppCanvas = React.createFactory(mui.AppCanvas);
var AppBar = React.createFactory(mui.AppBar);

const ThemeManager = new mui.Styles.ThemeManager();

const menuItems = [
    {
        text: 'alfa-react-ui',
    }
];

export interface IPageProps extends React.DOMAttributes {
    env: IEnv
}

export interface IPageIMap extends IState {
    get(key: 'pkg'): string;
    get(key: string): void;
}

export interface PageState extends IMap<IPageIMap> {

}

export class PageComponent extends React.Component<IPageProps, PageState> {
    static childContextTypes: {[key: string]: React.Validator<any>} = {
        muiTheme: React.PropTypes.object,
        env: React.PropTypes.object
    };

    props: IPageProps;
    state: PageState;

    refs: {
        [key: string]: React.Component<any, any>;
        packageNav: any
    };

    constructor(props: IPageProps, context) {
        super(props, context);

        function navigation(currState: IState, navState: IState, globalState: IState) {
            return currState.withMutations((state) => {
                state.set('pkg', navState.get('pkg'))
            })
        }

        bindState(<any>this, navigation, props.env);
    }

    componentWillUnmount() {
        unbindState(<any>this, this.props.env);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
            env: this.props.env
        };
    }

    render() {
        let packageName = this.state.map.get('pkg');

        return AppCanvas(null, [
            AppBar({
                title: packageName,
                onLeftIconButtonTouchTap: this.onLeftIconButtonTouchTap.bind(this)
            }),
            PackageNav({
                ref: 'packageNav'
            }),
            Layout({
                menu: Navigator(),
                content: null
            })
        ])
    }

    onLeftIconButtonTouchTap() {
        this.refs.packageNav.toggle()
    }
}

export var Page = React.createFactory<IPageProps>(PageComponent);