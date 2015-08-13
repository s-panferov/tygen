import React from 'react';
import block from 'bem-cn';

import { IDoc, IDocMap } from '../../../../awesome-typescript-loader/src/doc/doc';
import { Service, IPackageMap } from '../../service';

// import { Layout } from '../layout/layout';
// import { Navigator } from '../navigator/navigator';
// import { PackageNav } from '../package-nav/package-nav';

let pageCn = block('page');

export interface PageProps extends React.DOMAttributes {
}

export interface PageState {

}

export class Page extends React.Component<PageProps, PageState> {
    refs: {
        [key: string]: React.Component<any, any>;
        packageNav: any
    };

    // constructor(props: IPageProps, context) {
    //     super(props, context);
    //
    //     function navigation(currState: IState, navState: IState, globalState: IState) {
    //         return currState.withMutations((state) => {
    //             state.set('pkg', navState.get('pkg'))
    //         })
    //     }
    //
    //     bindState(<any>this, navigation, props.env);
    // }
    //
    // componentWillUnmount() {
    //     unbindState(<any>this, this.props.env);
    // }
    //
    // getChildContext() {
    //     return {
    //         muiTheme: ThemeManager.getCurrentTheme(),
    //         env: this.props.env
    //     };
    // }

    // render() {
    //     let packageName = this.state.map.get('pkg');
    //
    //     return AppCanvas(null, [
    //         AppBar({
    //             title: packageName,
    //             onLeftIconButtonTouchTap: this.onLeftIconButtonTouchTap.bind(this)
    //         }),
    //         PackageNav({
    //             ref: 'packageNav'
    //         }),
    //         Layout({
    //             menu: Navigator(),
    //             content: null
    //         })
    //     ])
    // }
    //
    // onLeftIconButtonTouchTap() {
    //     this.refs.packageNav.toggle()
    // }
}
