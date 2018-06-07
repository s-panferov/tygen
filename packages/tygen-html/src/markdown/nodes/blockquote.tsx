import * as React from 'react'
import { Blockquote } from '../mdast'
import { Children } from '../markdown-node'

export namespace BlockquoteUI {
	export interface Props {
		node: Blockquote
	}
}

export class BlockquoteUI extends React.Component<BlockquoteUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<blockquote>
				<Children node={node} />
			</blockquote>
		)
	}
}
