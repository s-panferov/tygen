import * as React from 'react'
import { Children } from '../markdown-node'
import { List, ListItem } from '../mdast'

export namespace ListUI {
	export interface Props {
		node: List
	}
}

export class ListUI extends React.Component<ListUI.Props, {}> {
	render() {
		const { node } = this.props
		const el = node.ordered ? 'ol' : 'ul'
		return React.createElement(
			el,
			{
				start: node.start
			},
			<Children node={node} />
		)
	}
}

export namespace ListItemUI {
	export interface Props {
		node: ListItem
	}
}

export class ListItemUI extends React.Component<ListItemUI.Props, {}> {
	render() {
		const { node } = this.props
		const checked = node.checked
		const isTask = checked != null
		return (
			<li className={isTask ? 'task-list-item' : undefined}>
				{isTask && (
					<input type="checkbox" className={'task-checkbox'} checked={checked || false} />
				)}
				<Children node={node} />
			</li>
		)
	}
}
