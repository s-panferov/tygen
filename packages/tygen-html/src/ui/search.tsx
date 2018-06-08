import React from 'react'
import { css, styles } from 'linaria'
import * as fuzz from 'fuzzaldrin-plus'
import { parseId, normalizePath } from '../helpers'
import { Badge } from './badge'
import cn from 'classnames'
import { Join } from './join'
import { RefLink, navigateTo } from '../ref-link'
import { SearchReflection } from '../../../tygen-reflector/src/reflection/search/reflection'
import { BaseView, withContext, ViewSettings } from '../view'
import { Toolbar } from './toolbar'

export interface SearchState {
	index: number
	query: string
	scope: string
	ready: boolean
	open: boolean
	results: string[]
}

export class SearchPage extends BaseView<SearchReflection> {
	render() {
		return <Toolbar pkg={'🔎'} search={this.props.reflection} />
	}
}

@withContext
export class Search extends React.Component<
	{ pkg?: string; version?: string; reflection?: SearchReflection; settings?: ViewSettings },
	SearchState
> {
	reflection?: SearchReflection = this.props.reflection
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
			<div {...styles(SearchBody)} onKeyDown={this.onKeyDown}>
				<select value={scope} onChange={this.onScopeChange}>
					<option value={'package'}>Package</option>
					<option value={'global'}>Global</option>
				</select>
				<input
					{...styles(SearchInput)}
					ref={r => (this.input = r!)}
					tabIndex={1}
					value={this.state.query}
					disabled={!this.state.ready}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onClick={this.onFocus}
					onChange={this.onChange}
				/>
				{this.state.open && (
					<div {...styles(SearchResults)}>
						<NotScrollable />
						{this.state.results.map((res, i) => {
							return <SearchItem key={res} id={res} focus={i === this.state.index} />
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
			window.location = normalizePath(this.props.settings!, '/_search') as any
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
			navigateTo(this.props.settings!, ref)
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

			return fuzz.filter(this.reflection.items, scopedQuery, { maxResults: 50 })
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

class SearchItem extends React.Component<{ id: string; focus: boolean }> {
	shouldComponentUpdate(nextProps: this['props']) {
		return this.props.id !== nextProps.id || this.props.focus !== nextProps.focus
	}

	render() {
		const { focus } = this.props
		const id = parseId(this.props.id)
		return (
			<RefLink reflection={{ id: this.props.id } as any}>
				<div {...styles(SearchItemBody, cn({ focus }))}>
					{id.pkg}&nbsp;<Badge>{id.version}</Badge>&nbsp;
					{id.module && (
						<Join
							joinWith={sep => (
								<span {...styles(SearchItemSep)} key={'mod-sep' + sep}>
									/
								</span>
							)}>
							{id.module.map((mod, i, list) => {
								return (
									<div
										{...styles(
											SearchItemPart,
											cn({
												main: !id.items && i === list.length - 1
											})
										)}
										key={'mod' + i}>
										{mod}
									</div>
								)
							})}
						</Join>
					)}
					{id.items && <span {...styles(SearchItemSep)}>/</span>}
					{id.items && (
						<Join
							joinWith={sep => (
								<span {...styles(SearchItemSep)} key={'item-sep' + sep}>
									/
								</span>
							)}>
							{id.items.map((item, i, list) => {
								return (
									<div
										key={'item' + i}
										{...styles(
											SearchItemPart,
											cn({ main: i === list.length - 1 })
										)}>
										{item.name}
									</div>
								)
							})}
						</Join>
					)}
				</div>
			</RefLink>
		)
	}
}

const SearchItemBody = css`
	height: 30px;
	display: flex;
	align-items: center;
	padding: 0 10px;
	color: #222;
	cursor: pointer;

	&:nth-child(even) {
		background-color: #f0f0f0;
	}

	&:hover {
		background-color: #eee;
	}

	&.focus {
		background-color: #fef;
	}
`

const SearchItemPart = css`
	&.main {
		font-weight: bold;
	}
`

const SearchItemSep = css`
	padding: 0 3px;
	color: #ccc;
`

const SearchBody = css`
	display: flex;
	align-items: center;
	padding: 0 10px;
	flex: 1 1 auto;
	position: relative;
`

const SearchInput = css`
	width: 100%;
	font-family: var(--monospace-font);
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
