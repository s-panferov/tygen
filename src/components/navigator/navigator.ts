import * as React from 'react';
import { DOM as dom } from 'react';
import * as block from 'bem-cn';
import * as mui from 'material-ui';
import * as path from 'path';

var Menu = React.createFactory(mui.Menu);
var Tabs = React.createFactory(mui.Tabs);
var Tab = React.createFactory(mui.Tab);

var { MenuItem } = mui;

import { IState } from '../../index';
import { IPackage, getFileStructure } from '../../service';
import { IContext, IMap, bindState, unbindState } from '../component';
import { navigate } from '../../actions';

export interface INavigatorProps extends React.HTMLAttributes {}
export interface INavigatorMap extends IState {
    get(key: 'pkg'): string
    get(key: 'path'): string
    get(key: string): void
}
export interface INavigatorState extends IMap<INavigatorMap> {

}

export class NavigatorComponent extends React.Component<INavigatorProps, INavigatorState> {
    static contextTypes: {[key: string]: React.Validator<any>} = {
        env: React.PropTypes.object
    };

    context: IContext;
    state: INavigatorState;
    props: INavigatorProps;

    constructor(props: INavigatorProps, context: IContext) {
        super(props, context);

        function navigation(curr: INavigatorMap, nav: IState, global: IState) {
            return curr.withMutations((state) => {
                state.set('pkg', nav.get('pkg'))
                     .set('path', nav.get('path'))
            })
        }

        bindState(<any>this, navigation, this.context.env);
    }

    componentWillUnmount() {
        unbindState(<any>this, this.context.env);
    }

    render() {
        let service = this.context.env.service;
        let map = this.state.map;
        let pkg = service.getPackage(map.get('pkg'));

        return dom.div(null,
            Tabs(null, [
                Tab({ label: 'Files' }),
                Tab({ label: 'Modules' })
            ]),
            Menu(
                _.extend(
                    {
                        onItemTap: (e, idx, menuItem) => this.onItemClick(menuItem)
                    },
                    renderFileItems(pkg, this.state.map.get('path'))
                )
            )
        )
    }

    onItemClick(menuItem: { isFolder: boolean, payload: string }) {
        let map = this.state.map;

        if (menuItem.isFolder) {
            this.context.env.ds.dispatch(navigate({
                pkg: map.get('pkg'),
                path: menuItem.payload
            }))
        } else {
            alert('file');
        }
    }
}

function renderFileItems(pkg: IPackage, targetPath: string) {
    let structure = getFileStructure(pkg, targetPath);

    let menuItems = [];

    if (structure.prevExists) {
        menuItems = menuItems.concat([
            {
                payload: structure.prevPath,
                text: structure.prevName || '/',
                iconClassName: 'icon icon-angle-double-left',
                isFile: false,
                isFolder: true
            }
        ]);
    }

    if (structure.currentName) {
        menuItems = menuItems.concat([
            {
                text: structure.currentName || '/',
                iconClassName: 'icon icon-folder-o',
                type: MenuItem.Types.SUBHEADER
            }
        ]);
    }

    menuItems = menuItems.concat(structure.folders.map((folder) => {
        return {
            payload: path.join(targetPath, folder),
            text: folder,
            isFile: false,
            isFolder: true,
            iconClassName: 'icon icon-folder-o'
        }
    }));

    menuItems = menuItems.concat(structure.files.map((file) => {
        return {
            payload: path.join(targetPath, file),
            text: file,
            isFile: true,
            isFolder: false,
            iconClassName: 'icon icon-file-text-o'
        }
    }));

    return { menuItems };
}

export var Navigator = React.createFactory<INavigatorProps>(NavigatorComponent);