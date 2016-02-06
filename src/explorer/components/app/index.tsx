import * as React from 'react';
import * as theme from '../theme';
import { History } from 'history';

const block = theme.block('app');
require('./index.css');

import Layout from '../layout';

interface AppProps {
    history: History;
}

export default class App extends React.Component<any, any> {
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
        return (
            <div className={ this.getClassName() }>
                <Layout className={ block('layout') }>

                </Layout>
            </div>
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
