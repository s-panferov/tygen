import * as React from 'react'
import { Image } from '../mdast'

export interface ImageUIProps {
	node: Image
}

export class ImageUI extends React.Component<ImageUIProps, {}> {
	shouldComponentUpdate(nextProps: this['props']) {
		return (
			nextProps.node.alt !== this.props.node.alt ||
			nextProps.node.title !== this.props.node.title ||
			nextProps.node.url !== this.props.node.url
		)
	}

	render() {
		const { node } = this.props
		return <img title={node.title || undefined} alt={node.alt || undefined} src={node.url} />
	}
}
