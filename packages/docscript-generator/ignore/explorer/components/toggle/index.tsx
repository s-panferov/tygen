import * as React from 'react'
import * as theme from '../theme'

let block = theme.block('toggle')
require('./index.css')

export interface ToggleProps extends React.CommonProps {
	label?: React.ReactNode
	toggled: boolean
	onToggle: () => void
}

export interface ToggleState {}

export default class Toggle extends React.Component<ToggleProps, ToggleState> {
	getClassName() {
		return block(theme.resolveTheme(this), {
			toggled: this.props.toggled
		}).mix(this.props.className)
	}

	render() {
		return (
			<div className={this.getClassName()} onClick={this.props.onToggle}>
				{this.props.label}
				{this.props.children}
			</div>
		)
	}
}
