import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps, actions } from '../../redux';
import { History } from 'history';

import autobind from '../../../lib/autobind';

import Service, { Route } from '../../service';
import { PluginRegistry } from '../../state';

const block = theme.block('app');
require('./index.css');

import { ModuleInfo } from '../../../doc';
import { Item } from '../../../doc/items';

import Layout from '../layout';
import Module from '../module';
import Nav from '../nav';
import NProgress from '../nprogress';
import ActivityManager from '../../activity';

interface AppReduxProps extends DispatchProps {
    activity?: ActivityManager;
    service?: Service;
    route?: Route;
    plugins?: PluginRegistry;

    module?: ModuleInfo;
    item?: Item;
}

interface AppProps extends AppReduxProps {
    history: History;
}

@connect(({ activity, service, route, plugins, module, item }): AppReduxProps => {
    return { activity, service, route, plugins, module, item };
})
export default class App extends React.Component<AppProps, void> {
    static contextTypes = theme.themeContext;
    constructor(props, context) {
        super(props, context);
    }

    getClassName() {
        return block(theme.resolveTheme(this));
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <NProgress activity={ this.props.activity }/>
                <Layout
                    className={ block('layout') }
                    sidebar={ <Nav
                        route={ this.props.route }
                        service={ this.props.service }
                        onNavigate={ this.onNavigate }
                    /> }
                >
                    <Module
                        plugins={ this.props.plugins }
                        route={ this.props.route }
                        module={ this.props.module }
                        item={ this.props.item }
                        onNavigate={ this.onNavigate }
                    />
                </Layout>
            </div>
        );
    }

    @autobind
    onNavigate(route: Route) {
        this.props.dispatch(
            actions.navigate(route)
        );
    }
}
