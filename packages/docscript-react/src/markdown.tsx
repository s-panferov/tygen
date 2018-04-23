import React from 'react'

const ReactMarkdown = require('react-markdown')

export interface MarkdownProps {
	source: string
}

export class Markdown extends React.Component<MarkdownProps> {
	render() {
		let { source } = this.props
		return <ReactMarkdown source={source} />
	}
}
