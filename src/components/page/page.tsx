import React from 'react';
import block from 'bem-cn';
import { Record } from 'immutable';

import { Doc, DocMap } from '../../doc/doc';
import { Service, PackageMap } from '../../service';

import { connect, Flux } from '../../flux';
import { NavigationRecord } from '../../state-i';

// import { Layout } from '../layout/layout';
// import { Navigator } from '../navigator/navigator';
import { Nav } from '../nav/nav';
import { Search } from '../search/search';
import { Path } from '../path/path';

let pageCn = block('page');
require('./page.css');

export interface PageProps extends React.CommonAttributes {
    data?: PageData
    flux?: Flux
}

export interface PageState {}

export class PageData extends Record({
    navigation: null
}) {
    navigation: NavigationRecord
}

@connect(PageData, (state, appState) => {
    state.navigation = appState.navigation;
})
export class Page extends React.Component<PageProps, PageState> {

    render() {
        let { navigation } = this.props.data;
        let { navigate } = this.props.flux.actions;
        return (
            <div className={ pageCn() }>
                <Nav
                    className={ pageCn('package-nav') }
                    navigation={ navigation }
                    navigate={ navigate }
                    service={ this.props.flux.addons.service }
                />
                <div className={ pageCn('content') }>
                    <Search className={ pageCn('search') } />
                    <Path
                        navigation={ navigation }
                        navigate={ navigate }
                        className={ pageCn('path') }
                    />
                </div>
            </div>
        )
    }

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
