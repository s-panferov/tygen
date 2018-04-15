import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import { TypeQueryReflection } from '../../doc/ast/type/type-query'

import SmartLink from '../../explorer/components/smart-link'

require('./index.css')
const block = theme.block('ts-type-query')

export interface TypeQueryProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	type: TypeQueryReflection
}

export interface TypeQueryState {}

export default class TypeQuery extends React.Component<TypeQueryProps, TypeQueryState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let typeQuery = this.props.type
		return (
			<span className={this.getClassName()}>
				<span key="typeof">typeof </span>
				<SmartLink route={typeQuery.ref}>{typeQuery.exprName}</SmartLink>
			</span>
		)
	}
}
