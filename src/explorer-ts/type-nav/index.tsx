import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as theme from '../../explorer/components/theme';

import Sticky from '../../explorer/components/sticky';
import SmartLink from '../../explorer/components/smart-link';
import ScrollSpy from 'rscrollspy';

import {
    Item
} from '../../doc/items';

require('./index.css');
const block = theme.block('ts-type-nav');

export interface TypeNavProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    items: Item[];
}

export interface TypeNavState {
    sticky?: boolean;
}

export default class TypeNav extends React.Component<TypeNavProps, TypeNavState> {
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

        this.renderItems = this.renderItems.bind(this);
        this.onSpyChange = this.onSpyChange.bind(this);
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
                        <ScrollSpy ids={ this.props.items.map(item => item.id) } onChange={ this.onSpyChange }>
                            { this.renderItems }
                        </ScrollSpy>
                    </div>
                </Sticky>
            </div>
        );
    }

    renderItems(inView: string, outView: string) {
        return this.props.items.map(item => {
            let className = block('item', {
                active: inView.indexOf(item.id) !== -1
            });

            let name = item.name;
            if (!name) {

            }

            return (
                <div
                    id={ `nav-${item.id}` }
                    className={ className }
                    key={ item.id }
                >
                    <SmartLink id={ item.id } className={ block('link') }>
                        { item.name }
                    </SmartLink>
                </div>
            );
        });
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

    onSpyChange(inView: string[]) {
        let id = inView[0];
        if (id) {
            let scroll: HTMLElement = ReactDOM.findDOMNode(this.refs.scroll) as any;
            if (scroll) {
                let elem: HTMLElement = scroll.querySelector(`#nav-${id}`) as any;
                let offsetTop = elem.offsetTop;
                if (offsetTop > scroll.scrollTop + scroll.offsetHeight) {
                    scroll.scrollTop = offsetTop;
                } else if (offsetTop < scroll.scrollTop) {
                    scroll.scrollTop = offsetTop - scroll.offsetHeight;
                }
            }
        }
    }
}
