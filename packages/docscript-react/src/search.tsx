import React from 'react'
import styled from 'styled-components'
import * as fuzz from 'fuzzaldrin-plus'
import { parseId } from './helpers'
import { Badge } from './ui/badge'
import cn from 'classnames'
import { Join } from './ui/join'
import { RefLink } from './ref-link'

export interface SearchState {
	index: number
	query: string
	scope: string
	ready: boolean
	open: boolean
	results: string[]
}

export class Search extends React.Component<{ pkg: string; version: string }, SearchState> {
	index?: string[]
	state: SearchState = {
		index: 0,
		query: '',
		scope: 'package',
		ready: false,
		open: false,
		results: []
	}

	input?: HTMLInputElement

	componentDidMount() {
		const url = new URL(window.location.toString())
		url.pathname = 'search.json'
		fetch(url.toString())
			.then(index => index.json())
			.then(index => {
				this.index = index
				this.setState({
					results: this.updateResults()
				})
			})
			.catch(e => console.error(e))

		const searchIndex = window.localStorage.getItem('searchIndex')
		const searchScope = window.localStorage.getItem('searchScope') || 'package'
		const searchQuery = window.localStorage.getItem('searchQuery') || ''

		this.setState({
			scope: searchScope,
			query: searchQuery,
			index: searchIndex != null ? Number(searchIndex) : 0,
			results: this.updateResults(searchQuery, searchScope)
		})
	}

	render() {
		const scope = this.state.scope
		return (
			<SearchBody onKeyDown={this.onKeyDown}>
				<select value={scope} onChange={this.onScopeChange}>
					<option value={'package'}>Package</option>
					<option value={'global'}>Global</option>
				</select>
				<SearchInput
					ref={r => (this.input = r)}
					tabIndex={1}
					value={this.state.query}
					disabled={this.state.ready}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onClick={this.onFocus}
					onChange={this.onChange}
				/>
				{this.state.open && (
					<SearchResults>
						<NotScrollable />
						{this.state.results.map((res, i) => {
							return <SearchItem key={res} id={res} focus={i === this.state.index} />
						})}
					</SearchResults>
				)}
			</SearchBody>
		)
	}

	onFocus = () => {
		this.setState({
			open: true
		})
	}

	onBlur = () => {
		this.setState({
			open: false
		})
	}

	onKeyDown = (e: React.KeyboardEvent<EventTarget>) => {
		const { index, results } = this.state
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			const nextIndex =
				e.key === 'ArrowUp'
					? index > 1 ? index - 1 : 0
					: index < results.length - 1 ? index + 1 : results.length - 1

			window.localStorage.setItem('searchIndex', nextIndex.toString())
			this.setState({
				index: nextIndex
			})
		} else if (e.key === 'Enter') {
			const ref = results[index]
			RefLink.navigateTo(ref)
		} else if (e.key === 'Escape') {
			this.setState({
				open: false
			})
		}
	}

	updateResults(query: string = this.state.query, scope = this.state.scope) {
		if (query && this.index) {
			const scopedQuery =
				scope === 'package' ? `${this.props.pkg}/${this.props.version}/${query}` : query

			return fuzz.filter(this.index, scopedQuery, { maxResults: 50 })
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

class NotScrollable extends React.Component {
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
				<SearchItemBody className={cn({ focus })}>
					{id.pkg}&nbsp;<Badge>{id.version}</Badge>&nbsp;
					{id.module && (
						<Join
							joinWith={sep => (
								<SearchItemSep key={'mod-sep' + sep}>/</SearchItemSep>
							)}>
							{id.module.map((mod, i, list) => {
								return (
									<SearchItemPart
										key={'mod' + i}
										className={cn({
											main: !id.items && i === list.length - 1
										})}>
										{mod}
									</SearchItemPart>
								)
							})}
						</Join>
					)}
					{id.items && <SearchItemSep>/</SearchItemSep>}
					{id.items && (
						<Join
							joinWith={sep => (
								<SearchItemSep key={'item-sep' + sep}>/</SearchItemSep>
							)}>
							{id.items.map((item, i, list) => {
								return (
									<SearchItemPart
										key={'item' + i}
										className={cn({ main: i === list.length - 1 })}>
										{item.name}
									</SearchItemPart>
								)
							})}
						</Join>
					)}
				</SearchItemBody>
			</RefLink>
		)
	}
}

const SearchItemBody = styled.div`
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

const SearchItemPart = styled.div`
	&.main {
		font-weight: bold;
	}
`

const SearchItemSep = styled.span`
	padding: 0 3px;
	color: #ccc;
`

const SearchBody = styled.div`
	display: flex;
	align-items: center;
	padding: 0 10px;
	flex: 1 1 auto;
	position: relative;
`

const SearchInput = styled.input`
	width: 100%;
	font-family: monospace;
	border: none;
	outline: none;
	border-bottom: 1px solid #ccc;
	margin-left: 10px;
`

const SearchResults = styled.div`
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
