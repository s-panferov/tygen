import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as theme from '../theme';
import Sticky from '../sticky';

require('./index.css');

const block = theme.block('sticky-scroll');

export interface StickyScrollProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
}

export interface StickyScrollState {
    sticky?: boolean;
}

export default class StickyScroll extends React.Component<StickyScrollProps, StickyScrollState> {
    static contextTypes = theme.themeContext;

    refs: {
        [key: string]: React.Component<any, any>,
        scroll: React.Component<any, any>
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            sticky: false
        };

        this.onScroll = this.onScroll.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onStickyStateChange = this.onStickyStateChange.bind(this);
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <Sticky
                    topOffset={ -20 }
                    stickyClass={ block('body') }
                    stickyStyle={{}}
                    onStickyStateChange={ this.onStickyStateChange }
                >
                    <div
                        ref='scroll'
                        className={ block('scroll') }
                        onScroll={ this.onScroll }
                        onWheel={ this.onMouseWheel }
                    >
                        { this.props.children }
                    </div>
                </Sticky>
            </div>
        );
    }

    getScroll() {
        return this.refs.scroll;
    }

    onScroll(e: React.UIEvent) {
        e.stopPropagation();
    }

    onStickyStateChange(state) {
        this.setState({
            sticky: state
        });
    }

    onMouseWheel(e: React.WheelEvent) {
        if (!this.state.sticky) {
            return true;
        }

        let el = ReactDOM.findDOMNode(this.refs.scroll);
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
