import * as React from 'react';
import * as theme from '../theme';
import { connect, DispatchProps, actions } from '../../redux';
import { History } from 'history';

import autobind from '../../../lib/autobind';

import Service, { Route } from '../../service';

const block = theme.block('app');
require('./index.css');

import Layout from '../layout';
import Module from '../module';
import Nav from '../nav';

interface AppReduxProps extends DispatchProps {
    service?: Service;
    route?: Route;
}

interface AppProps extends AppReduxProps {
    history: History;
}

@connect(({ service, route }): AppReduxProps => {
    return { service, route };
})
export default class App extends React.Component<AppProps, any> {
    static contextTypes = theme.themeContext;
    constructor(props, context) {
        super(props, context);

        this.state = {
            route: '/',
        };
    }

    componentDidMount() {
        this.props.history.listen(location => {
            this.setState({
                route: location.pathname,
            });
        });
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

    onPathChange(path: string) {
        this.props.history.pushState(
            null,
            path,
            { theme: this.state.theme }
        );

        this.setState({
            route: path
        });
    }
}
