import React from 'react'
import styled from 'styled-components'

const ReactMarkdown = require('react-markdown')

export interface MarkdownProps {
	source: string
}

export class Markdown extends React.Component<MarkdownProps> {
	render() {
		let { source } = this.props
		return (
			<MarkdownBody>
				<ReactMarkdown source={source} />
			</MarkdownBody>
		)
	}
}

const MarkdownBody = styled.div`
	p:last-child {
		margin-bottom: 0;
	}
`
