import * as React from 'react'
import { Link } from '../mdast'
import { Children } from '../markdown-node'

export namespace LinkUI {
	export interface Props {
		node: Link
	}
}

export class LinkUI extends React.Component<LinkUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<a href={node.url}>
				<Children node={node} />
			</a>
		)
	}
}
