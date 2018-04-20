import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import autobind from '../../lib/autobind'

require('./index.css')
const block = theme.block('ts-brackets')

export enum BracketsType {
	Angle = 'angle' as any,
	Round = 'round' as any,
	Curly = 'curly' as any,
	Square = 'square' as any
}

const BracketsMap: { [key: string]: [string, string] } = {
	[BracketsType.Angle]: ['<', '>'],
	[BracketsType.Round]: ['(', ')'],
	[BracketsType.Curly]: ['{', '}'],
	[BracketsType.Square]: ['[', ']']
}

export interface BracketsProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	type?: BracketsType
}

export interface BracketsState {
	hover: boolean
}

export default class Brackets extends React.Component<BracketsProps, BracketsState> {
	static contextTypes = theme.themeContext
	static defaultProps: BracketsProps = {
		type: BracketsType.Angle
	}

	constructor(props, context) {
		super(props, context)
		this.state = {
			hover: false
		}
	}

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let bracketProps = {
			onMouseEnter: this.onMouseEnter,
			onMouseLeave: this.onMouseLeave,
			className: block('bracket', {
				hover: this.state.hover
			})
		}

		let braces: [string, string] = BracketsMap[this.props.type]

		return (
			<span className={this.props.className}>
				<span key="left" {...bracketProps}>
					{braces[0]}
				</span>
				{this.props.children}
				<span key="right" {...bracketProps}>
					{braces[1]}
				</span>
			</span>
		)
	}

	@autobind
	onMouseEnter() {
		this.setState({
			hover: true
		})
	}

	@autobind
	onMouseLeave() {
		this.setState({
			hover: false
		})
	}
}
