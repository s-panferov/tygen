import { css, cx } from 'linaria'
import { TextItem } from './tree'
import { observer } from 'mobx-react'
import React from 'react'
import { TreeRender, NavTree } from './tree-render'

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
				className={cx(StructureNodeStyle)}>
				{item.info.kind === 'header' ? (
					<h4>{item.text}</h4>
				) : (
					<a href={item.info.href}>{item.text}</a>
				)}
			</div>
		)
	}
}

export class Sidebar extends React.Component<{
	tree: NavTree<StructureItem>
}> {
	render() {
		return (
			<TreeRender<StructureItem>
				tree={this.props.tree}
				itemRender={({ item, style }) => {
					return <StructureNode key={item.key} item={item} style={style} />
				}}
				rowHeight={({ item }) => (item.info.kind === 'header' ? 40 : 30)}
				onSelect={(_e, item) => {
					if (item.info.kind === 'link') {
						window.location.assign(item.info.href)
					}
				}}
			/>
		)
	}
}

const StructureNodeStyle = css`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	display: flex;
	align-items: center;
`
