import * as React from 'react'
import { Root } from '../mdast'
import { Children } from '../markdown-node'

export namespace RootUI {
	export interface Props {
		node: Root
	}
}

export class RootUI extends React.Component<RootUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<div>
				<Children node={node} />
			</div>
		)
	}
}
