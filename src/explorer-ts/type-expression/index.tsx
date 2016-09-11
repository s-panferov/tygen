import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import {
	ExpressionWithTypeArgumentsReflection,
} from '../../doc/ast/type/expression'

import {
	isTypeReferenceReflection
} from '../../doc/ast/type/type-reference'

import SmartLink from '../../explorer/components/smart-link'
import Paper from '../../explorer/components/paper'
import TypeArguments from '../type-arguments'
import Type from '../type'

require('./index.css')
const block = theme.block('ts-type-ref')

export interface TypeExpressionProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	expr: ExpressionWithTypeArgumentsReflection
}

export interface TypeExpressionState { }

export default class TypeExpression extends React.Component<TypeExpressionProps, TypeExpressionState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let expr = this.props.expr

		return (
			<Paper className={this.getClassName()}>
				{this.renderType()}
				{expr.typeArguments &&
					<TypeArguments typeArguments={expr.typeArguments} />}
			</Paper>
		)
	}

	renderType() {
		let expression = this.props.expr.expression
		let type = expression.type
		return <Type type={type} />
	}
}
