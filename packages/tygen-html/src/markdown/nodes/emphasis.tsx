import * as React from 'react'
import { Emphasis } from '../mdast'
import { Children } from '../markdown-node'

export namespace EmphasisUI {
	export interface Props {
		node: Emphasis
	}
}

export class EmphasisUI extends React.Component<EmphasisUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<em>
				<Children node={node} />
			</em>
		)
	}
}
