import React from 'react'
import { Reflection, ReflectionKind } from '@tygen/reflector'
import { RefLink, getKey, formatLink } from './ref-link'
import { observer } from 'mobx-react'
import { TreeRowProps, NavTree, TreeRender } from './ui/tree-render'
import { TextItem } from './ui/tree'
import { css, cx } from 'linaria'
import { CommentView } from './comment'
import { autobind } from 'core-decorators'

export const SectionNames = {
	[ReflectionKind.Interface]: 'Interfaces',
	[ReflectionKind.Class]: 'Classes',
	[ReflectionKind.TypeAlias]: 'Type Aliases',
	[ReflectionKind.Function]: 'Functions',
	[ReflectionKind.Variable]: 'Variables',
	[ReflectionKind.Module]: 'Modules',
	[ReflectionKind.Namespace]: 'Namespaces',
	getName(group: string): string {
		return (this as any)[group] || group
	}
}

export class HeaderItem extends TextItem<
	{
		selected?: boolean
	},
	ModuleItem
> {}

export class ReflectionItem extends TextItem<
	{
		reflection: Reflection
		selected?: boolean
	},
	ReflectionItem
> {}

export type ModuleItem = HeaderItem | ReflectionItem
export type GroupedReflections = { [key: string]: Reflection[] }

function extractStructure(groups: GroupedReflections) {
	return Object.keys(groups).map(key => {
		const items = groups[key]
		return new HeaderItem(
			key,
			{
				text: SectionNames.getName(key)
			},
			items.map(reflection => {
				const link = formatLink(reflection)
				return new ReflectionItem(getKey(reflection)!, {
					text: link.name,
					reflection
				})
			})
		)
	})
}

export interface GroupViewProps {
	groups: GroupedReflections
}

export class GroupView extends React.Component<GroupViewProps> {
	static groupReflections = groupReflections

	tree = new NavTree(extractStructure(this.props.groups))

	render() {
		return (
			<TreeRender<ModuleItem>
				tree={this.tree}
				rowHeight={i => (i.item instanceof HeaderItem ? 40 : 30)}
				onSelect={this.onSelect}
				itemRender={this.renderItem}
			/>
		)
	}

	@autobind
	renderItem(props: TreeRowProps<ModuleItem>) {
		if (props.item instanceof HeaderItem) {
			return <HeaderNode {...props} />
		} else if (props.item instanceof ReflectionItem) {
			return <ReflectionNode {...props as TreeRowProps<ReflectionItem>} />
		} else {
			return null
		}
	}

	@autobind
	onSelect(e: React.KeyboardEvent<HTMLElement>, item: ModuleItem) {
		if (item instanceof ReflectionItem) {
			const link = e.currentTarget.parentElement!.querySelector<HTMLElement>(
				`#${item.key} a`
			)!
			if (link) {
				link.click()
			}
		}
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

@observer
export class ReflectionNode extends React.Component<TreeRowProps<ReflectionItem>> {
	render() {
		const {
			item: { key, info },
			style
		} = this.props

		return (
			<div
				id={key}
				key={key}
				style={style}
				className={cx(ItemRow, info.selected && 'selected')}>
				<div className={ItemNameCell}>
					<RefLink reflection={info.reflection} />
				</div>
				<div className={ItemDescriptionCell}>
					<CommentView reflection={info.reflection} tag="summary" />
				</div>
			</div>
		)
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

export function groupReflections(reflections: Reflection[]): GroupedReflections {
	let groups: GroupedReflections = {}
	reflections.forEach(ref => {
		let kind: ReflectionKind = ref.kind
		if (ref.kind === ReflectionKind.Link) {
			kind = ref.target.kind
		}

		if (!groups[kind]) {
			groups[kind] = []
		}

		groups[kind].push(ref)
	})

	return groups
}
