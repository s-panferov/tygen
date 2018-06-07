import * as React from 'react'
import { TextNode } from '../mdast'

export interface TextUIProps {
	node: TextNode
}

export class TextUI extends React.Component<TextUIProps> {
	shouldComponentUpdate(nextProps: this['props']) {
		return nextProps.node.value !== this.props.node.value
	}

	render() {
		const { node } = this.props
		return <span>{node.value}</span>
	}
}
