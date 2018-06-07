import * as React from 'react'
import { Strong } from '../mdast'
import { Children } from '../markdown-node'

export namespace StrongUI {
	export interface Props {
		node: Strong
	}
}

export class StrongUI extends React.Component<StrongUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<strong>
				<Children node={node} />
			</strong>
		)
	}
}
