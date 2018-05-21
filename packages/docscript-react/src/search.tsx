import React from 'react'
import styled from 'styled-components'
import * as fuzz from 'fuzzaldrin-plus'
import { parseId } from './helpers'
import { Badge } from './ui/badge'
import cn from 'classnames'
import { Join } from './ui/join'
import { RefLink } from './ref-link'

export interface SearchState {
	scope: string
	ready: boolean
	results: string[]
}

export class Search extends React.Component<{ pkg: string; version: string }, SearchState> {
	state: SearchState = {
		scope: 'package',
		ready: false,
		results: []
	}

	index?: string[]

	componentDidMount() {
		const url = new URL(window.location.toString())
		url.pathname = 'search.json'
		fetch(url.toString())
			.then(index => index.json())
			.then(index => {
				this.index = index
			})
			.catch(e => console.error(e))

		this.setState({
			scope: window.localStorage.getItem('scope') || 'package'
		})
	}

	render() {
		const scope = this.state.scope
		return (
			<SearchBody>
				<select value={scope} onChange={this.onScopeChange}>
					<option value={'package'}>Package</option>
					<option value={'global'}>Global</option>
				</select>
				<SearchInput disabled={this.state.ready} onChange={this.onChange} />
				{this.state.results.length > 0 && (
					<SearchResults>
						<NotScrollable />
						{this.state.results.map(res => {
							return <SearchItem key={res} id={res} />
						})}
					</SearchResults>
				)}
			</SearchBody>
		)
	}

	onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const query = e.currentTarget.value
		if (query && this.index) {
			const scopedQuery =
				this.state.scope === 'package'
					? `${this.props.pkg}/${this.props.version}/${query}`
					: query

			this.setState({
				results: fuzz.filter(this.index, scopedQuery, { maxResults: 50 })
			})
		} else {
			this.setState({
				results: []
			})
		}
	}

	onScopeChange = (e: React.FormEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value
		window.localStorage.setItem('scope', value)
		this.setState({
			scope: value
		})
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

class SearchItem extends React.Component<{ id: string }> {
	render() {
		const id = parseId(this.props.id)
		return (
			<RefLink reflection={{ id: this.props.id } as any}>
				<SearchItemBody>
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
