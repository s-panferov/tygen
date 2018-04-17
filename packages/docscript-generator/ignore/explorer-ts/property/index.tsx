import * as React from 'react'
import * as theme from '../../explorer/components/theme'

import { PropertySignatureReflection } from '../../doc/ast/type/property'

import Type from '../type'
import Panel from '../panel'

require('./index.css')
const block = theme.block('ts-property')

export interface PropertyProps extends React.CommonProps {
	htmlProps?: React.HTMLAttributes
	property: PropertySignatureReflection
	inline: boolean
}

export interface PropertyState {}

export default class Property extends React.Component<PropertyProps, PropertyState> {
	static contextTypes = theme.themeContext

	getClassName() {
		return block(theme.resolveTheme(this)).mix(this.props.className)
	}

	render() {
		let property = this.props.property
		return (
			<Panel
				id={this.props.property.selfRef.id}
				inline={this.props.inline}
				figure={this.renderSignature()}
				className={this.getClassName()}
				title={property.name}
			/>
		)
	}

	renderSignature() {
		let property = this.props.property
		return (
			<span className={block('signature')}>
				{property.name}
				{property.optional ? '?' : ''}
				<span>: </span>
				<Type className={block('type')} type={property.type} />
			</span>
		)
	}
}
