import * as React from 'react';
import * as _ from 'lodash';
import * as mui from 'material-ui';

var LeftNav = React.createFactory(mui.LeftNav);
var MenuItem = mui.MenuItem;

import { IEnv, IState } from '../../index';
import { bindState, unbindState, IMap, IContext } from '../component';
import { navigate } from '../../actions';
import { Service, IPackageMap } from '../../service';

export interface IPackageNavProps {}

export interface IPackageNavMap {
    get(key: 'pkg'): string
    get(key: string): void
}

export interface IPackageNavState extends IMap<IPackageNavMap> {

}

export class PackageNavComponent extends React.Component<IPackageNavProps, IPackageNavState> {
    static contextTypes: {[key: string]: React.Validator<any>} = {
        env: React.PropTypes.object
    };

    state: IPackageNavState;
    props: IPackageNavProps;
    context: IContext;

    refs: {
        [key: string]: React.Component<any, any>;
        leftNav: any
    };

    constructor(props: IPackageNavProps, context: IContext) {
        super(props, context);

        function navigation(curr: IState, nav: IState, global: IState) {
            return curr.withMutations((state) => {
                state.set('pkg', nav.get('pkg'))
            })
        }

        bindState(<any>this, navigation, this.context.env);
    }

    componentWillUnmount() {
        unbindState(<any>this, this.context.env);
    }

    toggle() {
        this.refs.leftNav.toggle()
    }

    render() {
        let map = this.state.map;
        let env = this.context.env;
        let service = env.service;
        let packages = service.getPackages();

        return LeftNav(
            _.extend(
                {
                    ref: 'leftNav',
                    docked: false,
                    isInitiallyOpen: false,
                    onChange: (e, idx, menuItem) => this.onPackageChange(menuItem.payload)
                },
                renderPackageItems(packages, map.get('pkg'))
            )
        )
    }

    onLeftIconButtonTouchTap() {
        this.refs.leftNav.toggle()
    }

    onPackageChange(pkg: string) {
        this.context.env.ds.dispatch(navigate({ pkg }))
    }
}

function renderPackageItems(packages: IPackageMap, currentPackageName: string) {
    let selectedIndex;
    let i = 0;
    let menuItems = [<any>{ type: MenuItem.Types.SUBHEADER, text: 'Packages' }].concat(
        _.map(packages, (_pkg, key) => {
            i += 1;
            if (key == currentPackageName) {
                selectedIndex = i
            }
            return {
                payload: key,
                text: key
            }
        })
    );

    return { menuItems, selectedIndex }
}

export var PackageNav = React.createFactory<IPackageNavProps>(PackageNavComponent);