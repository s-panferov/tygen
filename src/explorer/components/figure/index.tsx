import * as React from 'react'
import * as theme from '../theme'

require('./index.css')
const block = theme.block('figure')

export interface FigureProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	clickable?: boolean
}

export interface FigureState {
}

export default class Figure extends React.Component<FigureProps, FigureState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this), {
			clickable: this.props.clickable
		}).mix(this.props.className)
	}

	render() {
		return (
			<div
				{ ...this.props.htmlProps }
				className={this.getClassName()}
				>
				{this.props.children}
			</div>
		)
	}
}
