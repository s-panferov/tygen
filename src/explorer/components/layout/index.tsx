import * as React from 'react';
import * as theme from '../theme';

const block = theme.block('layout');
require('./index.css');

import Nav from '../nav';

interface LayoutProps extends React.CommonProps {
}

export default class Layout extends React.Component<any, any> {
    static contextTypes = theme.themeContext;
    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <div className={ block('sidebar') }>
                    <Nav />
                </div>
                <div className={ block('content') }>

                </div>
            </div>
        );
    }
}
