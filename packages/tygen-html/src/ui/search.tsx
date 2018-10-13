import React from 'react'
import * as path from 'path'
import { css } from 'linaria'
import * as fuzz from 'fuzzaldrin-plus'

import { SearchReflection, ReflectionId } from '@tygen/reflector'

import { normalizePath } from '../helpers'
import { navigateTo, getKey, RefLink } from '../ref-link'
import { BaseView, ViewSettings, withSettings } from '../view'
import { Header } from './header'

export interface SearchState {
	index: number
	query: string
	scope: string
	ready: boolean
	open: boolean
	results: ReflectionId[]
}

interface ReflectionIdWithSearchPattern extends ReflectionId {
	searchPattern?: string
}

interface SearchReflectionWithPattern extends SearchReflection {
	items: ReflectionIdWithSearchPattern[]
}

export class SearchPage extends BaseView<SearchReflection> {
	render() {
		return <Header pkg={'🔎'} search={this.props.reflection} />
	}
}

export class Search_ extends React.Component<
	{ pkg?: string; version?: string; reflection?: SearchReflection; settings: ViewSettings },
	SearchState
> {
	reflection?: SearchReflectionWithPattern = this.props.reflection

	state: SearchState = {
		index: 0,
		query: '',
		scope: 'package',
		ready: !!this.props.reflection,
		open: false,
		results: []
	}

	input?: HTMLInputElement

	componentDidMount() {
		const searchIndex = window.localStorage.getItem('searchIndex')
		const searchScope = window.localStorage.getItem('searchScope') || 'package'
		const searchQuery = window.localStorage.getItem('searchQuery') || ''
		if (!this.props.reflection && window.location.protocol !== 'file:') {
			const url = normalizePath(this.props.settings!, '/_search/index.json')
			fetch(url.toString())
				.then(index => index.json())
				.then((reflection: SearchReflection) => {
					this.reflection = reflection
					this.reflection.items.forEach(item => {
						item.searchPattern = path.join(item.fileName, item.anchor)
					})
					this.setState({
						results: this.updateResults()
					})
				})
				.catch(e => console.error(e))
		}
		this.setState({
			scope: searchScope,
			query: searchQuery,
			index: searchIndex != null ? Number(searchIndex) : 0,
			results: this.updateResults(searchQuery, searchScope),
			ready: true
		})
	}

	render() {
		const scope = this.state.scope
		return (
			<div className={SearchBody} onKeyDown={this.onKeyDown}>
				<select value={scope} onChange={this.onScopeChange}>
					<option value={'package'}>Package</option>
					<option value={'global'}>Global</option>
				</select>
				<input
					className={SearchInput}
					ref={r => (this.input = r!)}
					tabIndex={1}
					value={this.state.query}
					placeholder="Search for items..."
					disabled={!this.state.ready}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onClick={this.onFocus}
					onChange={this.onChange}
				/>
				{this.state.open && (
					<div className={SearchResults}>
						<NotScrollable />
						{this.state.results.map((res, i) => {
							return (
								<SearchItem
									key={getKey(res)}
									id={res}
									focus={i === this.state.index}
								/>
							)
						})}
					</div>
				)}
			</div>
		)
	}

	onFocus = () => {
		if (
			window.location.protocol === 'file:' &&
			window.location.pathname.indexOf('_search') === -1
		) {
			// Navigate to search page for file mode, because file: does not allow
			// us to make a fetch request.
			window.location = normalizePath(this.props.settings, '/_search') as any
		}

		this.setState({
			open: true
		})
	}

	onBlur = () => {}

	onKeyDown = (e: React.KeyboardEvent<EventTarget>) => {
		const { index, results } = this.state
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			const nextIndex =
				e.key === 'ArrowUp'
					? index > 1
						? index - 1
						: 0
					: index < results.length - 1
						? index + 1
						: results.length - 1

			window.localStorage.setItem('searchIndex', nextIndex.toString())
			this.setState({
				index: nextIndex
			})
		} else if (e.key === 'Enter') {
			const ref = results[index]
			navigateTo(this.props.settings, ref)
		} else if (e.key === 'Escape') {
			this.setState({
				open: false
			})
		}
	}

	updateResults(query: string = this.state.query, scope = this.state.scope) {
		if (query && this.reflection) {
			const scopedQuery =
				scope === 'package' ? `${this.props.pkg}/${this.props.version}/${query}` : query

			return fuzz.filter(this.reflection.items, scopedQuery, {
				key: 'searchPattern',
				maxResults: 50
			})
		} else {
			return []
		}
	}

	onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const query = e.currentTarget.value
		window.localStorage.setItem('searchQuery', query)
		window.localStorage.setItem('searchIndex', '0')
		this.setState({
			query,
			index: 0,
			results: this.updateResults(query)
		})
	}

	onScopeChange = (e: React.FormEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value
		window.localStorage.setItem('searchScope', value)
		this.setState(state => ({
			results: this.updateResults(state.query, value),
			scope: value
		}))
	}
}

export const Search = withSettings(Search_)

export class NotScrollable extends React.Component {
	componentDidMount() {
		document.body.scrollTop = 0
		document.body.style.overflow = 'hidden'
	}

	componentWillUnmount() {
		document.body.style.overflow = 'scroll'
	}

	render() {
		return null
	}
}

class SearchItem extends React.Component<{ id: ReflectionId; focus: boolean }> {
	shouldComponentUpdate(nextProps: this['props']) {
		return this.props.id !== nextProps.id || this.props.focus !== nextProps.focus
	}

	render() {
		return <RefLink reflectionId={this.props.id} />
	}
}

const SearchBody = css`
	display: flex;
	align-items: center;
	padding: 0 10px;
	flex: 1 1 auto;
	position: relative;
`

const SearchInput = css`
	width: 100%;
	font-family: var(--font-mono);
	border: none;
	outline: none;
	border-bottom: 1px solid #ccc;
	margin-left: 10px;
`

const SearchResults = css`
	left: -1px;
	right: 0;
	position: absolute;
	top: 40px;
	height: calc(100vh - 40px);
	background-color: #fff;
	z-index: 2;
	border-left: 1px solid #ccc;
	overflow: scroll;
`
