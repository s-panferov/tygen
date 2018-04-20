import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import Comment from '../comment'
import Panel from '../panel'

import { IndexSignatureReflection } from '../../doc/ast/type/signature'

import Signature, { SignatureTypeStyle, BracketsType } from '../signature'

require('./index.css')
const block = theme.block('ts-index-signature')

export interface IndexSignatureProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	signature: IndexSignatureReflection
	inline: boolean
}

export interface IndexSignatureState {}

export default class IndexSignature extends React.Component<
	IndexSignatureProps,
	IndexSignatureState
> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let { signature } = this.props
		return (
			<Panel
				id={signature.selfRef.id}
				title={signature.name}
				inline={this.props.inline}
				figure={this.renderSignature()}
				className={this.getClassName()}>
				{signature.comment && <Comment comment={signature.comment} />}
			</Panel>
		)
	}

	renderSignature() {
		let { signature } = this.props
		return (
			<Signature
				typeStyle={SignatureTypeStyle.Colon}
				bracketsType={BracketsType.Square}
				signature={signature}
			/>
		)
	}
}
