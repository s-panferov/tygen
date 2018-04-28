import * as React from 'react'
import { BaseReflection } from '@docscript/reflector/src/reflection'
import { BaseView } from './view'
import { Markdown } from './ui/markdown'

export class CommentView extends BaseView<BaseReflection> {
	render() {
		const { reflection } = this.props
		if (!reflection.comments) {
			return null
		}

		return reflection.comments.map((comment, i) => {
			switch (comment.kind) {
				case 'text':
					return <Markdown key={i} source={comment.text} />
				default:
					console.warn(`Unknown comment type ${comment.kind}`)
					return null
			}
		})
	}
}
