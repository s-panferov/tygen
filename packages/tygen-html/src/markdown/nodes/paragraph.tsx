import * as React from 'react'
import { Paragraph } from '../mdast'
import { Children } from '../markdown-node'

export namespace ParagraphUI {
	export interface Props {
		node: Paragraph
	}
}

export class ParagraphUI extends React.Component<ParagraphUI.Props, {}> {
	render() {
		const { node } = this.props
		return (
			<p>
				<Children node={node} />
			</p>
		)
	}
}
