import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import { VariableDeclarationReflection, VariableDeclarationType } from '../../doc/ast/var'

import Heading from '../../explorer/components/heading'
import Figure from '../../explorer/components/figure'
import SmartLink from '../../explorer/components/smart-link'
import Paper from '../../explorer/components/paper'
import Comment from '../comment'
import Type from '../type'

require('./index.css')
const block = theme.block('ts-variable')

export interface VariableProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	item: VariableDeclarationReflection
}

export interface VariableState {}

export default class Variable<P extends VariableProps> extends React.Component<P, VariableState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	getHeader(type: VariableDeclarationType) {
		switch (type) {
			case VariableDeclarationType.Var:
				return 'Variable'
			case VariableDeclarationType.Let:
				return 'Variable'
			case VariableDeclarationType.Const:
				return 'Let'
		}
	}

	getLabel(type: VariableDeclarationType) {
		switch (type) {
			case VariableDeclarationType.Var:
				return 'var'
			case VariableDeclarationType.Let:
				return 'let'
			case VariableDeclarationType.Const:
				return 'const'
		}
	}

	render() {
		let vrb = this.props.item

		return (
			<Paper id={vrb.selfRef.id} className={this.getClassName()} highlight={false}>
				<Heading key="heading" lvl={1}>
					{this.getHeader(vrb.varType) + ' '}
					{vrb.name}
				</Heading>
				{vrb.comment && <Comment key="comment" comment={vrb.comment} />}
				<Figure>
					<span key="label">{this.getLabel(vrb.varType)} </span>
					{vrb.name}
					<span key="colon">: </span>
					<Type key="type" type={vrb.type} />
					{vrb.initializer && [
						<span key="equals"> = </span>,
						<span key="initializer">{vrb.initializer}</span>
					]}
				</Figure>
			</Paper>
		)
	}
}
