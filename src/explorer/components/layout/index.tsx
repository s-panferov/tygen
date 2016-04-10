import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as theme from '../theme';

const block = theme.block('layout');
require('./index.css');

interface LayoutProps extends React.CommonProps {
    sidebar?: React.ReactNode;
    reverse?: boolean;

    sidebarClassName?: string | { toString(): string };
    contentClassName?: string | { toString(): string };
}

export default class Layout extends React.Component<LayoutProps, any> {
    static contextTypes = theme.themeContext;

    constructor(props, context) {
        super(props, context);
        this.onScroll = this.onScroll.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
    }

    refs: {
        [key: string]: React.Component<any, any>,
        sidebar: React.Component<any, any>
    };

    getClassName() {
        return block(theme.resolveTheme(this), {
            reverse: this.props.reverse
        }).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                {
                    this.props.sidebar &&
                        <div
                            ref='sidebar'
                            className={ block('sidebar').mix(this.props.sidebarClassName) }
                            onScroll={ this.onScroll }
                            onWheel={ this.onMouseWheel }
                        >
                            { this.props.sidebar }
                        </div>
                }
                <div className={ block('content').mix(this.props.contentClassName) }>
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

    onScroll(e: React.UIEvent) {
        e.stopPropagation();
    }

    onMouseWheel(e: React.WheelEvent) {
        let el = ReactDOM.findDOMNode(this.refs.sidebar);
        if (e.deltaY > 0 && el.clientHeight + el.scrollTop >= el.scrollHeight) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        else if (e.deltaY < 0 && el.scrollTop <= 0) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        return true;
    }
}
