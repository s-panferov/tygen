import { TextItem } from './ui/tree'
import { observer } from 'mobx-react'
import React from 'react'
import { RefLink, PreparedLink, formatLink } from './ref-link'
import { TreeRowProps, NavTree, TreeRender } from './ui/tree-render'
import { CommentView } from './comment'
import { cx, css } from 'linaria'
import { autobind } from 'core-decorators'
import {
	Reflection,
	ReflectionId,
	ReflectionPath,
	ReflectionIdWithChildren
} from '@tygen/reflector'

export class HeaderItem extends TextItem<
	{
		kind: 'header'
		selected?: boolean
	},
	StructureItem
> {}

export class ReflectionItem extends TextItem<
	{
		kind: 'reflection'
		link: PreparedLink
		reflection?: Reflection
		selected?: boolean
	},
	ReflectionItem
> {
	static fromReflection(reflection: Reflection) {
		const link = formatLink(reflection)
		return new ReflectionItem(link.href, {
			kind: 'reflection',
			text: link.name,
			link,
			reflection
		})
	}

	static fromId(id: ReflectionId | ReflectionPath): ReflectionItem {
		const id1 = id as ReflectionIdWithChildren
		const link = formatLink(id)
		return new ReflectionItem(
			link.href,
			{
				kind: 'reflection',
				text: link.name,
				link
			},
			id1.children &&
				id1.children.map(ref => {
					return ReflectionItem.fromId(ref)
				})
		)
	}
}

export type StructureItem = HeaderItem | ReflectionItem

@observer
export class ReflectionNode extends React.Component<
	TreeRowProps<ReflectionItem> & { wide?: boolean }
> {
	render() {
		const {
			item: { key, info },
			style,
			wide,
			item
		} = this.props

		return (
			<div
				id={key}
				key={key}
				style={{
					...style,
					// FIXME bad assertion
					fontWeight: info.link.anchor.startsWith('folder') ? 'bold' : 'normal',
					paddingLeft: `${(item.depth - 1) * 10}px`
				}}
				className={cx(ItemRow, info.selected && 'selected')}>
				<div className={ItemNameCell}>
					<RefLink preparedLink={info.link} />
				</div>
				{wide &&
					info.reflection && (
						<div className={ItemDescriptionCell}>
							<CommentView reflection={info.reflection} tag="summary" />
						</div>
					)}
			</div>
		)
	}
}

@observer
export class HeaderNode extends React.Component<TreeRowProps<HeaderItem>> {
	render() {
		const {
			item: { key, info },
			style
		} = this.props

		return (
			<h3 key={key} style={style} className={cx(HeaderRow, info.selected && 'selected')}>
				{info.text}
			</h3>
		)
	}
}

export type RenderWith = {
	[key: string]: <I>(
		row: TreeRowProps<I>,
		structure: StructureProps
	) => React.ReactElement<TreeRowProps<I>>
}

export interface StructureProps {
	tree: NavTree<StructureItem>
	renderWith?: RenderWith
	wide?: boolean
}

export class Structure extends React.Component<StructureProps> {
	static defaultProps = {
		renderWith: {
			header: (row: TreeRowProps<HeaderItem>) => <HeaderNode {...row} />,
			reflection: (row: TreeRowProps<ReflectionItem>, structure) => (
				<ReflectionNode wide={structure.wide} {...row} />
			)
		} as RenderWith
	}

	render() {
		return (
			<TreeRender<StructureItem>
				tree={this.props.tree}
				rowHeight={i => (i.item instanceof HeaderItem ? 40 : 30)}
				onSelect={this.onSelect}
				itemRender={this.renderItem}
			/>
		)
	}

	@autobind
	renderItem(props: TreeRowProps<StructureItem>) {
		const element = this.props.renderWith![props.item.info.kind]
		if (element) {
			return element(props, this.props)
		} else {
			return null
		}
	}

	@autobind
	onSelect(e: React.KeyboardEvent<HTMLElement>, item: StructureItem) {
		if (item instanceof ReflectionItem) {
			const link = e.currentTarget.parentElement!.querySelector<HTMLElement>(
				item.info.link.anchor
			)
			if (link) {
				link.click()
			}
		}
	}
}

const HeaderRow = css`
	display: flex;
	align-items: center;

	&.selected {
		background-color: #eee;
	}

	margin: 0;
	padding: 0;
`

const ItemRow = css`
	display: flex;
	align-items: center;

	&.selected {
		background-color: #eee;
	}

	& > div {
		padding-left: 10px;
		padding-right: 10px;
	}
`

const ItemNameCell = css`
	min-width: 150px;
	white-space: nowrap;
	display: flex;
	align-items: center;
`

const ItemDescriptionCell = css`
	flex: 1 1 auto;
	display: flex;
	align-items: center;
`
