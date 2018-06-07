import * as React from 'react'
import { Heading } from '../mdast'
import { Children } from '../markdown-node'

export namespace HeadingUI {
	export interface Props {
		node: Heading
	}
}

export class HeadingUI extends React.Component<HeadingUI.Props, {}> {
	render() {
		const { node } = this.props
		const level = `h${node.depth}`
		return React.createElement(level, {}, <Children node={node} />)
	}
}
