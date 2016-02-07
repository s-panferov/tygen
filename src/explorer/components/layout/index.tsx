import * as React from 'react';
import * as theme from '../theme';

const block = theme.block('layout');
require('./index.css');

interface LayoutProps extends React.CommonProps {
    sidebar: React.ReactNode;
}

export default class Layout extends React.Component<LayoutProps, any> {
    static contextTypes = theme.themeContext;
    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <div className={ block('sidebar') }>
                    { this.props.sidebar }
                </div>
                <div className={ block('content') }>
                    {
                        React.Children.map(this.props.children, child => {
                            if (theme.isReactElement(child)) {
                                return React.cloneElement(child, {
                                    className: theme.joinClasses(child.props.className, block('item'))
                                });
                            }
                        })
                    }
                </div>
            </div>
        );
    }
}
