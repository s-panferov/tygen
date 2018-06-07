import * as React from 'react'
import { Footnote } from '../mdast'
import { Children } from '../markdown-node'

export namespace FootnoteUI {
	export interface Props {
		node: Footnote
	}
}

export class FootnoteUI extends React.Component<FootnoteUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<em>
				<Children node={node} />
			</em>
		)
	}
}
