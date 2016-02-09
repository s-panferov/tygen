import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps, actions } from '../../redux';
import { History } from 'history';

import autobind from '../../../lib/autobind';

import Service, { Route } from '../../service';
import { PluginRegistry } from '../../state';

const block = theme.block('app');
require('./index.css');

import Layout from '../layout';
import Module from '../module';
import Nav from '../nav';

interface AppReduxProps extends DispatchProps {
    service?: Service;
    route?: Route;
    plugins?: PluginRegistry;
}

interface AppProps extends AppReduxProps {
    history: History;
}

@connect(({ service, route, plugins }): AppReduxProps => {
    return { service, route, plugins };
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
        let module = this.props.service.getModule(this.props.route);
        return (
            <div className={ this.getClassName() }>
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
                        module={ module }
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
