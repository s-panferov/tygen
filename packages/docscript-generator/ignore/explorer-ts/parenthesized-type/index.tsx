import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import { ParenthesizedTypeReflection } from '../../doc/ast/type/parenthesized'

import Brackets, { BracketsType } from '../brackets'
import Type from '../type'

require('./index.css')
const block = theme.block('ts-parenthesized-type')

export interface ParenthesizedTypeProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	type: ParenthesizedTypeReflection
}

export interface ParenthesizedTypeState {}

export default class ParenthesizedType extends React.Component<
	ParenthesizedTypeProps,
	ParenthesizedTypeState
> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let type = this.props.type
		return (
			<Brackets type={BracketsType.Round}>
				<Type type={type.type} />
			</Brackets>
		)
	}
}
