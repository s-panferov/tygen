import * as React from 'react'
import * as theme from '../../explorer/components/theme'
import { Comment as DocComment } from '../../doc/ast/comment'

import Section from '../section'

let ReactMarkdown = require('react-markdown')

require('./index.css')
const block = theme.block('ts-comment')

export interface CommentProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	comment: DocComment
}

export interface CommentState { }

export default class Comment extends React.Component<CommentProps, CommentState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let comment = this.props.comment
		if (!comment || (!comment.description && comment.tags.length === 0)) {
			return null
		} else {
			return (
				<div className={this.getClassName()}>
					<ReactMarkdown source={comment.description} />
					{this.renderTags(comment)}
				</div>
			)
		}
	}

	renderTags(comment: DocComment) {
		let result = []

		let params = comment.tags.filter(tag => tag.title == 'param')
		if (params.length) {
			let paramComponents = params.map(param => {
				return (
					<Section key={param.name} title={param.name}>
						<ReactMarkdown source={param.description} />
					</Section>
				)
			})

			let section = (
				<Section key='params' title='Arguments:' lvl={1}>
					{paramComponents}
				</Section>
			)

			result.push(section)
		}

		let returns = comment.tags.filter(tag => tag.title == 'return')
		console.log(returns)

		if (returns.length) {
			let returnsComponents = returns.map(returns => {
				return (
					<Section key={returns.name} title={returns.name}>
						<ReactMarkdown source={returns.description} />
					</Section>
				)
			})

			let section = (
				<Section key='returns' title='Returns:' lvl={1}>
					{returnsComponents}
				</Section>
			)

			result.push(section)
		}

		return result
	}
}
