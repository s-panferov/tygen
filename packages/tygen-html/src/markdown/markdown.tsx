import * as React from 'react'

import { MarkdownNode } from './markdown-node'
import { parseMarkdown, Root } from './markdown-parser'

import { MarkdownStyle } from '../theme/markdown'

import 'prismjs/themes/prism-coy.css'
import './markdown.css'

export type UrlGetter = (fileName: string) => Promise<string> | undefined

export interface MarkdownProps {
	text: string
	className?: string
	position?: Position
	style?: React.CSSProperties
	html?: React.AllHTMLAttributes<HTMLDivElement>
}

export interface MarkdownState {
	root: Root
}

export interface Position {
	offset: number
	top: number
	setCursor: (offset: number, top: number) => void
}

export class Markdown extends React.Component<MarkdownProps, MarkdownState> {
	state = {
		root: this.parseMarkdown(this.props.text)
	}

	componentWillReceiveProps(nextProps: this['props']) {
		if (nextProps.text !== this.props.text) {
			this.updateAST(nextProps)
		}
	}

	shouldComponentUpdate(nextProps: this['props'], _nextState: this['state']) {
		return nextProps.text !== this.props.text
	}

	updateAST(nextProps: this['props']) {
		this.setState({
			root: this.parseMarkdown(nextProps.text)
		})
	}

	parseMarkdown(text: string) {
		return parseMarkdown(text)
	}

	render() {
		const { style, html } = this.props
		if (this.state.root) {
			return (
				<div className={MarkdownStyle} style={style} {...html}>
					<MarkdownNode node={this.state.root} />
				</div>
			)
		} else {
			return null
		}
	}
}
