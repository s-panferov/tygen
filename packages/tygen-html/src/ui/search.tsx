import React, { HTMLAttributes } from 'react'
import * as path from 'path'
import { css } from 'linaria'
import * as fuzz from 'fuzzaldrin-plus'

import { SearchReflection, ReflectionId, Reflection } from '@tygen/reflector'

import { normalizePath } from '../helpers'
import { navigateTo, getKey, RefLink } from '../ref-link'
import { BaseView, ViewSettings, withSettings } from '../view'
import { Header } from './header'
import { observer } from 'mobx-react'
import { Payload } from '../utils/payload'
import { computed, observable } from 'mobx'
import { mobxPromise } from '../utils/promise'
import { NavTree, TreeRender, TreeRowProps } from './tree-render'
import { StructureItem, HeaderItem, ReflectionItem, HeaderNode } from '../structure'
import { autobind } from 'core-decorators'

interface ReflectionIdWithSearchPattern extends ReflectionId {
	searchPattern?: string
}

export class SearchPage extends BaseView<SearchReflection> {
	render() {
		return <Header search={this.props.reflection} />
	}
}

@observer
export class Search_ extends React.Component<{
	reflection?: SearchReflection
	settings: ViewSettings
}> {
	input?: HTMLInputElement

	@observable
	open: boolean = false

	@observable
	query: string = ''

	reflection = mobxPromise()
		.autorun(
			(): Promise<SearchReflection> | Payload<SearchReflection> => {
				if (this.props.reflection) {
					return new Payload.Value(this.props.reflection)
				}

				if (window.location.protocol !== 'file:') {
					const search = this.props.settings.search
					const currentPackage = this.currentPackage

					let url: string | undefined
					if (search && search.disableGlobal) {
						if (currentPackage) {
							url = normalizePath(
								this.props.settings!,
								path.join(currentPackage.replace('#', '/'), 'search.json')
							)
						}
					} else {
						// global search index
						url = normalizePath(this.props.settings!, '_search/index.json')
					}

					if (!url) {
						return new Payload.Nothing()
					}

					return fetch(url.toString()).then(res => res.json())
				}

				throw new Error('Unreachable')
			}
		)
		.build()

	@computed
	get currentPackage(): string | undefined {
		const reflection = (window as any).__ref as Reflection
		if (!reflection || !reflection.id) {
			return undefined
		}

		return `${reflection.id![0].name}#${reflection.id![0].version}`
	}

	@computed
	get items(): Payload<{ local: ReflectionId[]; global: ReflectionId[] }> {
		function mapId(id: ReflectionIdWithSearchPattern) {
			id.searchPattern = path.join(id.fileName, id.anchor)
			return id
		}

		return this.reflection.payload.map(ref => {
			const currentPackage = this.currentPackage
			const rest = Object.keys(ref.packages).filter(p => p != currentPackage)
			return {
				local: currentPackage ? ref.packages[currentPackage].map(mapId) : [],
				global: [].concat.apply([], rest.map(r => ref.packages[r])).map(mapId)
			}
		})
	}

	@computed
	get results(): Payload<{ local: ReflectionId[]; global: ReflectionId[] }> {
		return this.items.map(items => {
			return {
				local:
					this.query.length > 2
						? fuzz.filter(items.local, this.query, {
								key: 'searchPattern',
								maxResults: 20
						  })
						: [],
				global:
					this.query.length > 2
						? fuzz.filter(items.global, this.query, {
								key: 'searchPattern',
								maxResults: 20
						  })
						: []
			}
		})
	}

	@computed
	get resultTree(): Payload<NavTree<StructureItem>> {
		return this.results.map(res => {
			const tree = new NavTree([
				res.local.length > 0
					? new HeaderItem(
							'local',
							{
								kind: 'header',
								text: 'Current package results'
							},
							res.local.map(ReflectionItem.fromId)
					  )
					: undefined,
				res.global.length > 0
					? new HeaderItem(
							'global',
							{
								kind: 'header',
								text: 'Global results'
							},
							res.global.map(ReflectionItem.fromId)
					  )
					: undefined
			].filter(Boolean) as StructureItem[])

			const searchIndex = Number(window.localStorage.getItem('searchIndex') || 0)
			tree.ext.nav.setIndex(searchIndex)

			return tree
		})
	}

	componentDidMount() {
		window.document.body.addEventListener('keydown', this.onWindowKeyDown)
		const searchQuery = window.localStorage.getItem('searchQuery') || ''
		this.query = searchQuery
	}

	componentWillUnmount() {
		window.document.body.removeEventListener('keydown', this.onWindowKeyDown)
	}

	render() {
		return (
			<div className={SearchBody}>
				<input
					className={SearchInput}
					ref={r => (this.input = r!)}
					tabIndex={1}
					value={this.query}
					placeholder="Search for items..."
					disabled={typeof window === 'undefined' || !this.items.isValue()}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onClick={this.onFocus}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
				/>
				{this.open && <Overlay onClick={this.onClose} />}
				{this.open && (
					<div className={SearchResults}>
						<NotScrollable />
						{this.resultTree.match({
							Value: tree => {
								return (
									<TreeRender<StructureItem>
										tree={tree}
										disableSearch
										rowHeight={i => (i.item instanceof HeaderItem ? 40 : 50)}
										itemRender={this.renderItem}
									/>
								)
							},
							Nothing: () => null,
							Error: () => null,
							Loading: () => null
						})}
					</div>
				)}
			</div>
		)
	}

	@autobind
	renderItem(row: TreeRowProps<StructureItem>) {
		switch (row.item.info.kind) {
			case 'header':
				return <HeaderNode {...row as any} />
			case 'reflection':
				return <SearchNode {...row as any} onClick={this.onClose} />
			default:
				return null
		}
	}

	onFocus = () => {
		if (
			window.location.protocol === 'file:' &&
			window.location.pathname.indexOf('_search') === -1
		) {
			// Navigate to search page for file mode, because file: does not allow
			// us to make a fetch request.
			window.location = normalizePath(this.props.settings, '_search') as any
		}

		this.open = true
	}

	onBlur = () => {}

	onClose = () => {
		this.open = false
	}

	onWindowKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			this.open = false
		}
	}

	onKeyDown = (e: React.KeyboardEvent<EventTarget>) => {
		if (e.key === 'ArrowUp') {
			if (this.resultTree.isValue()) {
				const index = this.resultTree.value.ext.nav.up()
				window.localStorage.setItem('searchIndex', index.toString())
			}
		} else if (e.key === 'ArrowDown') {
			if (this.resultTree.isValue()) {
				const index = this.resultTree.value.ext.nav.down()
				window.localStorage.setItem('searchIndex', index.toString())
			}
		} else if (e.key === 'Enter') {
			if (this.resultTree.isValue()) {
				const item = this.resultTree.value.ext.nav.current
				if (item && item.info.kind === 'reflection') {
					navigateTo(this.props.settings, item.info.id!)
				}
				this.open = false
			}
		}
	}

	onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const query = e.currentTarget.value
		window.localStorage.setItem('searchQuery', query)
		window.localStorage.setItem('searchIndex', '0')
		this.query = query
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

export class Overlay extends React.Component<HTMLAttributes<any>> {
	render() {
		return (
			<div
				{...this.props}
				style={{
					position: 'fixed',
					top: 30,
					right: 0,
					bottom: 0,
					left: 0
				}}
			/>
		)
	}
}

@observer
class SearchNode extends React.Component<TreeRowProps<ReflectionItem> & { onClick: () => void }> {
	render() {
		const { style, item } = this.props
		return (
			<div
				style={{
					paddingLeft: (item.depth + 1) * 10,
					...style,
					display: 'flex',
					alignItems: 'center',
					outline: item.info.selected ? '5px solid #eee' : undefined,
					backgroundColor: item.info.selected ? '#eee' : undefined
				}}>
				<RefLink preparedLink={item.info.link} onClick={this.props.onClick}>
					<React.Fragment>
						<span>{item.info.link.name}</span>{' '}
						<div style={{ color: '#999' }}>{item.info.id!.fileName}</div>
					</React.Fragment>
				</RefLink>
			</div>
		)
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
	background-color: transparent;
	margin-left: 10px;
`

const SearchResults = css`
	left: -1px;
	right: 0;
	position: absolute;
	top: 30px;
	height: calc(100vh - 40px);
	background-color: #fff;
	z-index: 2;
	border-left: 1px solid #ccc;
	overflow: scroll;
	padding: 5px 15px;
`
