import * as React from 'react';
import { History } from 'history';

interface ExplorerProps {
    history: History;
}

export default class Explorer extends React.Component<any, any> {
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

    render() {
        return (
            <div>
                <h1>HELLO</h1>
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
