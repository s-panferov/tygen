import React from 'react'
import { css } from 'linaria'

import { Markdown as MardownRenderer } from '../markdown'

export interface MarkdownProps {
	source: string
}

export class Markdown extends React.Component<MarkdownProps> {
	render() {
		let { source } = this.props
		return (
			<div className={MarkdownBody}>
				<MardownRenderer text={source} />
			</div>
		)
	}
}

const MarkdownBody = css`
	pre {
		min-width: 0;
		overflow: scroll;
	}

	& h1:first-child {
		padding-top: 0;
		margin-top: 0;
	}

	p:last-child {
		margin-bottom: 0;
	}
`
