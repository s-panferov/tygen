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
    searchQuery?: string;
}

export interface SearchProps extends React.CommonProps {
    htmlProps?: React.HTMLAttributes;
    route: Route;
}

@connect(({ searchActive, searchQuery }): SearchReduxProps => {
    return { searchActive, searchQuery };
})
export default class Search extends React.Component<SearchProps & SearchReduxProps, void> {
    static contextTypes = theme.themeContext;

    handlers: any;

    constructor(props, context) {
        super(props, context);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handlers = {

        };
    }

    getClassName() {
        return block(theme.resolveTheme(this), {
        }).mix(this.props.className);
    }

    render() {
        return (
            <Hotkeys className={ block('hotkeys') } handlers={ this.handlers }>
                <div
                    className={ this.getClassName() }
                >
                    <div
                        className={ block('toggle') }
                        onClick={ this.toggleSearch }
                    >
                        <img
                            className={ block('icon') }
                            src={ require('./icon.svg') }
                        />
                    </div>
                    {
                        this.props.searchActive &&
                            <div className={ block('main') }>
                                <div className={ block('input') }>
                                    <input
                                        className={ block('control') }
                                        autoFocus={ true }
                                        value={ this.props.searchQuery }
                                        onChange={ this.onChange }
                                    >
                                    </input>
                                </div>
                            </div>
                    }
                </div>
            </Hotkeys>
        );
    }

    onChange(e: React.FormEvent) {
        let val = (e.target as any).value;
        this.props.dispatch(
            actions.changeSearchQuery(val)
        );
    }

    toggleSearch() {
        this.props.dispatch(
            actions.toggleSearch()
        );
    }
}
