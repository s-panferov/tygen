import * as React from 'react'
import * as theme from '../theme'

require('./index.css')
const block = theme.block('heading')

export enum HeadingLevel {
	H1 = 1,
	H2 = 2,
	H3 = 3,
	H4 = 4
}

export interface HeadingProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	lvl?: HeadingLevel
}
export interface HeadingState {}

export default class Heading extends React.Component<HeadingProps, HeadingState> {
	static contextTypes = theme.themeContext
	static defaultProps = {
		lvl: HeadingLevel.H1
	}

	getClassName() {
		return block(theme.resolveTheme(this), {
			lvl: this.props.lvl
		}).mix(this.props.className)
	}

	render() {
		return React.createElement(
			`h${this.props.lvl}`,
			Object.assign({}, this.props.htmlProps, { className: this.getClassName() }),
			this.props.children
		)
	}
}
