import React from 'react';
import block from 'bem-cn';
import { omit } from 'lodash';

let navCn = block('search');
require('./search.css');

export interface SearchProps extends React.HTMLAttributes {}

export interface SearchState {}

export class Search extends React.Component<SearchProps, SearchState> {
    render() {
        let className = navCn().mix(this.props.className);
        return <div { ...this.props } className={ className }>
            <input type='text' placeholder='Type to search...' />
        </div>
    }
}
