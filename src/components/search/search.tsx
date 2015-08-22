import React from 'react';
import block from 'bem-cn';
import { omit } from 'lodash';
import { Record } from 'immutable';
import { connect, ActionCreators } from '../../flux';
import autobind from '../../lib/autobind';

import { DocR, SearchR } from '../../state-i';

let searchCn = block('search');
require('./search.css');

export interface SearchProps extends React.CommonAttributes {
    actions?: ActionCreators;
    data?: SearchData;
}

export interface SearchState { }

export class SearchData extends Record({
    search: null
}) {
    search: SearchR
}

@connect(SearchData, (state, appState) => {
    state.search = appState.search;
})
export class Search extends React.Component<SearchProps, SearchState> {
    render() {
        let { search } = this.props.data;
        let className = searchCn().mix(this.props.className);
        return <div { ...omit(this.props, 'data') } className={ className }>
            <input
                type='text'
                placeholder='Type to search...'
                value={ search.query }
                onChange={ this.handleChange }
            />
            { this.renderSearchResult(search) }
        </div>
    }

    renderSearchResult(search: SearchR) {
        let resultsCn = searchCn('results')({
            expanded: !!search.query.length
        });
        return (
            <div className={ resultsCn }>
                { search.docs.map(this.renderDocResult) }
            </div>
        )
    }

    @autobind
    handleChange(e) {
        let { actions } = this.props;

        let val = e.currentTarget.value;
        actions.search(val);
    }

    @autobind
    renderDocResult(doc: DocR) {
        console.log(doc)
        return <div>{ doc.fileInfo.withPackage }</div>;
    }
}
