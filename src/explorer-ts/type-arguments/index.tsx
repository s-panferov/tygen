import * as React from 'react'
import * as theme from '../../explorer/components/theme'
import Join from '../../explorer/components/join'

import {
	TypeReflection,
} from '../../doc/ast/type'

import Brackets from '../brackets'
import Type from '../type'

require('./index.css')
const block = theme.block('ts-type-arguments')

export interface TypeArgumentsProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	typeArguments: TypeReflection[]
}

export interface TypeArgumentsState { }

export default class TypeArguments extends React.Component<TypeArgumentsProps, TypeArgumentsState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let typeArguments = this.props.typeArguments
		return <Brackets>
			<Join>
				{
					typeArguments.map((typeArg, i) => {
						return <Type key={typeArg.selfRef.id} type={typeArg} />
					})
				}
			</Join>
		</Brackets>
	}
}
