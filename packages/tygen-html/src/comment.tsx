import * as React from 'react'
import { Reflection } from '@tygen/reflector'
import { Markdown } from './ui/markdown'
import { css, cx } from 'linaria'

export class CommentView extends React.Component<{
	reflection: Reflection
	inline?: boolean
}> {
	render() {
		const { reflection, inline } = this.props
		if (!reflection.comments) {
			return null
		}

		return (
			<div className={cx(CommentBody, inline && 'inline')}>
				{reflection.comments.map((comment, i) => {
					switch (comment.kind) {
						case 'text':
							return <Markdown key={i} source={comment.text} />
						default:
							console.warn(`Unknown comment type ${comment.kind}`)
							return null
					}
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

		&:hover {
			opacity: 1;
		}
	}
`
