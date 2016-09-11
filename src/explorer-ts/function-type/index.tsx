import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import {
	FunctionTypeReflection
} from '../../doc/ast/type/signature'

import Signature from '../signature'

require('./index.css')
const block = theme.block('ts-function-type')

export interface FunctionTypeProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	foo: FunctionTypeReflection
}

export interface FunctionTypeState { }

export default class FunctionType extends React.Component<FunctionTypeProps, FunctionTypeState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		return <Signature
			className={this.getClassName()}
			signature={this.props.foo.signature}
			/>
	}
}
