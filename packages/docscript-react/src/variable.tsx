import * as React from 'react'
import { VariableReflection } from '@docscript/reflector/src/reflection'
import { BaseView } from './view'
import { TypeView } from './type'
import styled from 'styled-components'

export class VariableView extends BaseView<VariableReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span>
				<VariableName>{reflection.name}</VariableName>:{' '}
				{<TypeView reflection={reflection.type} />}
			</span>
		)
	}
}

const VariableName = styled.span`
	color: #40739e;
`
