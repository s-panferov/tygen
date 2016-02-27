import * as React from 'react';
import * as theme from '../theme';

import { Route } from '../../state';
import SmartLink from '../smart-link';
import Hotkeys from '../hotkeys';

import { connect, DispatchProps, actions } from '../../redux';

require('./index.css');
const block = theme.block('search');

export interface SearchReduxProps extends DispatchProps {
    searchActive?: boolean;
}

export interface SearchProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    route: Route;
}

@connect(({ searchActive }): SearchReduxProps => {
    return { searchActive };
})
export default class Search extends React.Component<SearchProps & SearchReduxProps, void> {
    static contextTypes = theme.themeContext;

    handlers: any;

    constructor(props, context) {
        super(props, context);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.handlers = {

        };
    }

    getClassName() {
        return block(theme.resolveTheme(this), {
        }).mix(this.props.className);
    }

    render() {
        return (
            <Hotkeys handlers={ this.handlers }>
                <div
                    className={ this.getClassName() }
                >
                    <img
                        className={ block('icon') }
                        src={ require('./icon.svg') }
                        onClick={ this.toggleSearch }
                    />
                    {
                        this.props.searchActive &&
                            <div className={ block('main') }>
                                <div className={ block('input') }>
                                    <input className={ block('control') } autoFocus={ true }>
                                    </input>
                                </div>
                            </div>
                    }
                </div>
            </Hotkeys>
        );
    }

    toggleSearch() {
        this.props.dispatch(
            actions.toggleSearch()
        );
    }
}
