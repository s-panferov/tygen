import * as React from 'react'
import { Delete } from '../mdast'
import { Children } from '../markdown-node'

export namespace DeleteUI {
	export interface Props {
		node: Delete
	}
}

export class DeleteUI extends React.Component<DeleteUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<del>
				<Children node={node} />
			</del>
		)
	}
}
