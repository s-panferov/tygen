import { Reflection, ReflectionKind } from '@tygen/reflector'
import { TextItem, Tree, TextItemInfo } from './tree'
import React from 'react'
import { observer } from 'mobx-react'

import { List, WindowScroller, AutoSizer, ListRowProps } from 'react-virtualized'
import { css, cx } from 'linaria'
import { reaction } from 'mobx'
import { createLink } from './ref-link'

export interface HeaderInfo extends TextItemInfo {
	kind: 'header'
	text: string
}

export interface LinkInfo extends TextItemInfo {
	kind: 'link'
	text: string
	href: string
}

export type StructureInfo = HeaderInfo | LinkInfo

export type HeaderItem = TextItem<HeaderInfo, StructureInfo>
export const HeaderItem: new (
	key: string,
	info: HeaderInfo,
	children?: StructureItem[]
) => TextItem<HeaderInfo, StructureInfo> = TextItem

export type LinkItem = TextItem<LinkInfo, TextItemInfo>
export const LinkItem: new (key: string, info: LinkInfo, children?: StructureItem[]) => TextItem<
	LinkInfo,
	StructureInfo
> = TextItem

export type StructureItem = LinkItem | HeaderItem

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
export class Structure extends React.Component<{ tree: Tree<StructureItem> }> {
	componentDidMount() {
		reaction(
			r => {
				return this.props.tree.flat.slice()
			},
			console.log,
			{
				onError: e => console.error(e),
				equals: (a, b) => {
					return a === b
				}
			}
		)
	}

	render() {
		const { tree } = this.props
		const flatTree = tree.flat.slice()

		return (
			<div>
				<input
					className={InputStyle}
					placeholder="Search for contents..."
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
										containerStyle={
											{
												// overflowX: 'scroll'
											}
										}
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

	onSearch = (e: React.FormEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value
		if (value) {
			this.props.tree.filter(value)
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
					paddingLeft: item.depth * 20
				}}
				className={cx(StructureNodeStyle)}>
				{item.info.kind === 'header' ? <h4>{item.text}</h4> : item.text}
			</div>
		)
	}
}

const InputStyle = css`
	outline: none;
	border: none;
	border-bottom: 1px solid #eee;
	width: 100%;
	padding: 4px;
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
