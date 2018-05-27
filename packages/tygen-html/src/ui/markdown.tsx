import React from 'react'
import { css, styles } from 'linaria'

const ReactMarkdown = require('react-markdown')

export interface MarkdownProps {
	source: string
}

export class Markdown extends React.Component<MarkdownProps> {
	render() {
		let { source } = this.props
		return (
			<div {...styles(MarkdownBody)}>
				<ReactMarkdown source={source} />
			</div>
		)
	}
}

const MarkdownBody = css`
	p:last-child {
		margin-bottom: 0;
	}
`
