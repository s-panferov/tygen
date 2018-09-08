import * as React from 'react'
import { BaseReflection } from '@tygen/reflector/src/reflection'
import { BaseView } from './view'
import { Markdown } from './ui/markdown'
import { css } from 'linaria'

export class CommentView extends BaseView<BaseReflection> {
	render() {
		const { reflection } = this.props
		if (!reflection.comments) {
			return null
		}

		return (
			<div className={CommentBody}>
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
`
