import { Reflection, ReflectionKind } from '@tygen/reflector'
import { TextItem, Tree, QueryEngine, TreeItem } from './tree'
import React from 'react'
import { observer } from 'mobx-react'

import { List, WindowScroller, AutoSizer, ListRowProps } from 'react-virtualized'
import { css, cx } from 'linaria'
import { createLink } from './ref-link'

import { score, match, prepareQuery, IFilterOptions } from 'fuzzaldrin-plus'
import { observable, action } from 'mobx'

const FuzzOptions = Object.freeze({
	pathSeparator: '->'
})

const queryEngine: QueryEngine<IFilterOptions> = {
	get Options(): IFilterOptions {
		throw new Error('Virtual')
	},
	score,
	match
}

export class HeaderItem extends TextItem<
	{
		kind: 'header'
		text: string
		selected?: boolean
	},
	StructureItem
> {}

export class LinkItem extends TextItem<
	{
		kind: 'link'
		text: string
		href: string
		selected?: boolean
	},
	LinkItem
> {}

export type StructureItem = LinkItem | HeaderItem

export type TreeItemWithSelection = TreeItem<{ selected?: boolean }>
export type TreeWithSelection = Tree<TreeItemWithSelection>

export class TreeNavigation {
	private tree: TreeWithSelection

	@observable
	private index = -1

	@observable.ref
	current: TreeItemWithSelection | undefined

	constructor(tree: TreeWithSelection) {
		this.tree = tree
	}

	reset() {
		this.modify(() => {
			this.index = -1
		})
	}

	@action
	private modify(cb: () => void) {
		if (this.current) {
			this.current.info.selected = false
		}
		cb()
		this.current = this.tree.flat[this.index]
		if (this.current) {
			this.current.info.selected = true
		}
	}

	@action
	down() {
		this.modify(() => {
			this.index++
			if (this.index >= this.tree.flat.length) {
				this.index = this.tree.flat.length - 1
			}
		})
	}

	@action
	up() {
		this.modify(() => {
			this.index--
			if (this.index < 0) {
				this.index = 0
			}
		})
	}
}

export function createStructure(reflection: Reflection): StructureItem[] {
	let result = [] as StructureItem[]

	switch (reflection.kind) {
		case ReflectionKind.Package:
			if (reflection.modules && reflection.modules.length > 0) {
				result.push(
					new HeaderItem(
						'structure',
						{
							text: 'Structure',
							kind: 'header' as 'header'
						},
						reflection.modules.map(mod => {
							const link = createLink(mod)
							return new LinkItem(link.href, {
								kind: 'link',
								text: link.name,
								href: link.href
							})
						})
					)
				)
			}

			if (reflection.exports && reflection.exports.length > 0) {
				result.push(
					new HeaderItem(
						'exports',
						{
							text: 'Exports',
							kind: 'header'
						},
						reflection.exports.map(mod => {
							const link = createLink(mod)
							return new LinkItem(link.href, {
								kind: 'link',
								text: link.name,
								href: link.href
							})
						})
					)
				)
			}
	}

	return result
}

@observer
export class Structure extends React.Component<{
	tree: Tree<StructureItem>
	nav: TreeNavigation
}> {
	render() {
		const { tree } = this.props
		const flatTree = tree.flat.slice()

		return (
			<div>
				<input
					className={InputStyle}
					placeholder="Search for contents..."
					onKeyDown={this.onKeyDown}
					onChange={this.onSearch}
				/>
				<WindowScroller scrollElement={typeof window !== 'undefined' ? window : undefined}>
					{({ height, isScrolling, registerChild, onChildScroll, scrollTop }: any) => (
						<AutoSizer disableHeight>
							{({ width }) => (
								<div className={StructureStyle} ref={registerChild}>
									<List
										{...{ flatTree }}
										autoHeight
										height={height}
										style={{
											overflow: 'visible',
											outline: 'none'
										}}
										containerStyle={{
											// overflowX: 'scroll'
											overflow: 'visible',
											outline: 'none'
										}}
										isScrolling={isScrolling}
										onScroll={onChildScroll}
										overscanRowCount={2}
										rowCount={flatTree.length}
										rowHeight={i =>
											flatTree[i.index].info.kind === 'header' ? 30 : 25
										}
										rowRenderer={this.rowRender}
										scrollTop={scrollTop}
										width={width}
									/>
								</div>
							)}
						</AutoSizer>
					)}
				</WindowScroller>
			</div>
		)
	}

	onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			this.props.nav.down()
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			this.props.nav.up()
		}
	}

	@action
	onSearch = (e: React.FormEvent<HTMLInputElement>) => {
		this.props.nav.reset()
		const value = e.currentTarget.value
		if (value) {
			const preparedQuery = prepareQuery(value, { ...FuzzOptions })
			this.props.tree.filter(value, { preparedQuery, ...FuzzOptions }, queryEngine)
		} else {
			this.props.tree.resetFilter()
		}
	}

	rowRender = ({ index, key, style }: ListRowProps) => {
		const { tree } = this.props
		const row = tree.flat[index]

		return <StructureNode key={key} style={style} item={row} />
	}
}

@observer
export class StructureNode extends React.Component<{
	item: StructureItem
	style: React.CSSProperties
}> {
	render() {
		const { item, style } = this.props
		return (
			<div
				style={{
					...style,
					paddingLeft: 5 + item.depth * 20,
					backgroundColor: item.info.selected ? '#f0f0f0' : undefined
				}}
				tabIndex={0}
				className={cx(StructureNodeStyle)}>
				{item.info.kind === 'header' ? <h4>{item.text}</h4> : item.text}
			</div>
		)
	}
}

const InputStyle = css`
	outline: none;
	border: none;
	background-color: #eee;
	border-radius: 5px;
	width: 100%;
	padding: 4px;
	margin-bottom: 7px;
`

const StructureNodeStyle = css`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	display: flex;
	align-items: center;
`

const StructureStyle = css`
	h1,
	h2,
	h3,
	h4,
	h5 {
		margin: 0;
		padding: 0;
	}
`
