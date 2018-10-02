import React from 'react'
import { observer } from 'mobx-react'
import { action, computed } from 'mobx'
import { List, WindowScroller, AutoSizer, ListRowProps, Index } from 'react-virtualized'
import { score, match, prepareQuery, IFilterOptions } from 'fuzzaldrin-plus'

import { Tree, QueryEngine, TreeNavigation, TreeItem } from './tree'
import { css } from 'linaria'

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

export type TreeRowProps<I> = ListRowProps & {
	item: I
}

export interface ItemRenderer<I> {
	(opts: TreeRowProps<I>): React.ReactChild
}

export class NavTree<
	I extends TreeItem,
	E extends { nav: TreeNavigation<I> } = { nav: TreeNavigation<I> }
> extends Tree<I, E> {
	constructor(items: I[] = [], ext?: ((tree: Tree<I, {}>) => E)) {
		super(items, tree => {
			return Object.assign({}, ext && ext(tree), { nav: new TreeNavigation(this) })
		})
	}
}

@observer
export class TreeRender<I extends TreeItem> extends React.Component<{
	tree: NavTree<I>
	itemRender: ItemRenderer<I>
	rowHeight: number | ((indext: Index & { item: I }) => number)
	onSelect?: (e: React.KeyboardEvent, item: I) => void
}> {
	@computed
	private get rowHeight(): number | ((index: Index) => number) {
		const rowHeight = this.props.rowHeight
		return typeof rowHeight === 'function'
			? ({ index }: Index) => {
					return rowHeight({ item: this.props.tree.flat[index], index })
			  }
			: rowHeight
	}

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
				{this.props.children}
				<WindowScroller
					serverWidth={250}
					serverHeight={600}
					scrollElement={typeof window !== 'undefined' ? window : undefined}>
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
										rowHeight={this.rowHeight}
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
		const { nav } = this.props.tree.ext
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			nav.down()
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			nav.up()
		} else if (e.key === 'Enter') {
			if (nav.current && this.props.onSelect) {
				this.props.onSelect(e, nav.current)
			}
		}
	}

	@action
	onSearch = (e: React.FormEvent<HTMLInputElement>) => {
		this.props.tree.ext.nav.reset()
		const value = e.currentTarget.value
		if (value) {
			const preparedQuery = prepareQuery(value, { ...FuzzOptions })
			this.props.tree.filter(value, { preparedQuery, ...FuzzOptions }, queryEngine)
		} else {
			this.props.tree.resetFilter()
		}
	}

	rowRender = (props: ListRowProps) => {
		const { tree } = this.props
		const item = tree.flat[props.index]

		return this.props.itemRender({
			item,
			...props
		})
	}
}

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

const InputStyle = css`
	outline: none;
	border: none;
	background-color: #eee;
	border-radius: 5px;
	width: 100%;
	padding: 4px;
	margin-bottom: 7px;
	max-width: 300px;
`
