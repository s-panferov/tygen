/// <reference path="./defines.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createHistory }  from 'history';
let useQueries = require('history/lib/useQueries');
let history = useQueries(createHistory)();

class Explorer extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            route: '/',
        };
    }

    componentDidMount() {
        history.listen(location => {
            this.setState({
                route: location.pathname,
            });
        });
    }

    render() {
        return (
            <div>
            </div>
        );
    }

    onPathChange(path: string) {
        history.pushState(null, path, { theme: this.state.theme });

        this.setState({
            route: path
        });
    }
}

export function runApp() {
    let reactApp = document.createElement('div');
    reactApp.id = 'react-app';
    document.body.appendChild(reactApp);

    ReactDOM.render(
        React.createElement(Explorer),
        reactApp
    );
}

document.addEventListener('DOMContentLoaded', runApp, false);
