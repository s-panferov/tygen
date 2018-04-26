import * as React from 'react'
import { BaseReflection } from '@docscript/reflector/src/reflection'
import { ReflectionView } from './view'
import { Markdown } from './ui/markdown'

export class CommentView extends ReflectionView<BaseReflection> {
	render() {
		const { reflection } = this.props
		if (!reflection.comments) {
			return null
		}

		return reflection.comments.map(comment => {
			switch (comment.kind) {
				case 'text':
					return <Markdown source={comment.text} />
				default:
					console.warn(`Unknown comment type ${comment.kind}`)
					return null
			}
		})
	}
}
