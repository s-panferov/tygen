import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as theme from '../../explorer/components/theme';

import Sticky from '../../explorer/components/sticky';
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

export interface TypeNavState {}

export default class TypeNav extends React.Component<TypeNavProps, TypeNavState> {
    static contextTypes = theme.themeContext;

    refs: {
        [key: string]: React.Component<any, any>,
        body: React.Component<any, any>
    };

    constructor(props, context) {
        super(props, context);

        this.renderItems = this.renderItems.bind(this);
        this.onSpyChange = this.onSpyChange.bind(this);
    }

    getClassName() {
        return block(theme.resolveTheme(this)).mix(this.props.className);
    }

    render() {
        return (
            <div className={ this.getClassName() }>
                <Sticky ref='body' topOffset={ -20 } stickyClass={ block('body') } stickyStyle={{}}>
                    <ScrollSpy ids={ this.props.items.map(item => item.id) } onChange={ this.onSpyChange }>
                        { this.renderItems }
                    </ScrollSpy>
                </Sticky>
            </div>
        );
    }

    renderItems(inView: string, outView: string) {
        return this.props.items.map(item => {
            let className = block('item', {
                active: inView.indexOf(item.id) !== -1
            });
            return (
                <div
                    id={ `nav-${item.id}` }
                    className={ className }
                    key={ item.id }
                >
                    { item.name }
                </div>
            );
        });
    }

    onSpyChange(inView: string[]) {
        let id = inView[0];
        if (id) {
            let body: HTMLElement = ReactDOM.findDOMNode(this.refs.body) as any;
            if (body) {
                let elem: HTMLElement = body.querySelector(`#nav-${id}`) as any;
                let offsetTop = elem.offsetTop;
                if (offsetTop > body.scrollTop + body.offsetHeight) {
                    body.scrollTop = offsetTop;
                } else if (offsetTop < body.scrollTop) {
                    body.scrollTop = offsetTop - body.offsetHeight;
                }
            }
        }
    }
}
