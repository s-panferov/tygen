import * as React from 'react'
import { Reflection } from '@tygen/reflector'
import { Markdown } from './ui/markdown'
import { css, cx } from 'linaria'

export class CommentView extends React.Component<{
	reflection: Reflection
	inline?: boolean
	tag?: string
}> {
	render() {
		const { reflection, tag, inline } = this.props

		let text: string[] = []
		if (tag) {
			if (reflection.tags) {
				const tagObj = reflection.tags.find(t => t.name === tag)
				if (tagObj && tagObj.text) {
					text.push(tagObj.text)
				}
			}
		} else if (reflection.comments) {
			text.push(...reflection.comments.filter(c => c.kind === 'text').map(doc => doc.text))
		}

		if (text.length === 0) {
			return null
		}

		return (
			<div className={cx(CommentBody, inline && 'inline')}>
				{text.map((text, i) => {
					return <Markdown key={i} source={text} />
				})}
			</div>
		)
	}
}

const CommentBody = css`
	margin: 10px 0px;

	&.inline {
		display: inline-block;
		opacity: 0.5;
		max-width: 600px;
		border-left: 2px solid #ccc;
		padding-left: 10px;

		* {
			font-size: 12px !important;
		}

		&:hover {
			opacity: 1;
		}
	}
`
