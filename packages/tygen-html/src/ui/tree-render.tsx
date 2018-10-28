import React from 'react'
import { observer } from 'mobx-react'
import { action, computed, observable } from 'mobx'
import { List, WindowScroller, ListRowProps, Index } from 'react-virtualized'
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
	(opts: TreeRowProps<I>): React.ReactChild | null
}

export class NavTree<
	I extends TreeItem,
	E extends { nav: TreeNavigation<I> } = { nav: TreeNavigation<I> }
> extends Tree<I, E> {
	constructor(items: I[] = [], ext?: ((tree: Tree<I, {}>) => E)) {
		super(items, tree => {
			return Object.assign({}, ext && ext(tree), { nav: new TreeNavigation(tree) })
		})
	}
}

@observer
export class TreeRender<I extends TreeItem> extends React.Component<{
	tree: NavTree<I>
	itemRender: ItemRenderer<I>
	searchPlaceholder?: string
	rowHeight: number | ((indext: Index & { item: I }) => number)
	onSearch?: (query?: string) => void
	onSelect?: (e: React.KeyboardEvent<HTMLElement>, item: I) => void
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

	@observable
	query: string = ''

	render() {
		const { tree, searchPlaceholder } = this.props
		const flatTree = tree.flat.slice()

		return (
			<div>
				<input
					value={this.query}
					className={InputStyle}
					placeholder={searchPlaceholder || 'Search for contents...'}
					onKeyDown={this.onKeyDown}
					onChange={this.onSearchChange}
				/>
				{this.props.children}
				<WindowScroller
					serverHeight={700}
					scrollElement={typeof window !== 'undefined' ? window : undefined}>
					{({ height, isScrolling, onChildScroll, registerChild, scrollTop }: any) => (
						<div {...{ 'data-virtual': true }} ref={registerChild}>
							<List
								{...{ flatTree }}
								autoHeight
								autoWidth
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
								overscanRowCount={50}
								rowCount={flatTree.length}
								rowHeight={this.rowHeight}
								rowRenderer={this.rowRender}
								scrollTop={scrollTop}
								width={1100}
								onScroll={onChildScroll}
							/>
						</div>
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
			} else if (this.props.onSearch) {
				this.props.onSearch(this.query)
			}
		}
	}

	@action
	onSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value
		this.query = value

		if (this.props.onSearch) {
			return
		} else {
			this.props.tree.ext.nav.reset()
			if (value) {
				const preparedQuery = prepareQuery(value, { ...FuzzOptions })
				this.props.tree.filter(value, { preparedQuery, ...FuzzOptions }, queryEngine)
			} else {
				this.props.tree.resetFilter()
			}
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
