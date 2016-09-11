import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import {
	CallSignatureReflection
} from '../../doc/ast/type/signature'

import Signature, { SignatureTypeStyle } from '../signature'

import Paper from '../../explorer/components/paper'
import Figure from '../../explorer/components/figure'
import Comment from '../comment'
import Section from '../section'
import Panel from '../panel'

require('./index.css')
const block = theme.block('ts-call-signature')

export interface CallSignatureProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	signature: CallSignatureReflection
	inline: boolean
}

export interface CallSignatureState { }

export default class CallSignature extends React.Component<CallSignatureProps, CallSignatureState> {
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
				className={this.getClassName()}
				>
				{signature.comment &&
					<Comment comment={signature.comment} />
				}
			</Panel>
		)
	}

	renderSignature() {
		let { signature } = this.props
		return (
			<Signature
				typeStyle={SignatureTypeStyle.Colon}
				signature={signature}
				/>
		)
	}
}
