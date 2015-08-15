import React from 'react';
import block from 'bem-cn';
import { Record } from 'immutable';

import { Doc, DocMap } from '../../doc/doc';
import { Service, PackageMap } from '../../service';

import { connect } from '../../flux';
import { NavigationRecord } from '../../state-i';

// import { Layout } from '../layout/layout';
// import { Navigator } from '../navigator/navigator';
import { PackageNav } from '../package-nav/package-nav';

let pageCn = block('page');
require('./page.css');

export interface PageProps extends React.CommonAttributes {
    data?: PageData
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
        return (
            <div className={ pageCn() }>
                <PackageNav className={ pageCn('package-nav') } />
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
