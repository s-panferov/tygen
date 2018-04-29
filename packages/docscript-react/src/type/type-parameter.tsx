import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { TypeParameterReflection } from '@docscript/reflector/src/reflection/type-parameter/reflection'

export class TypeParameterView extends BaseView<TypeParameterReflection> {
	render() {
		const { reflection } = this.props
		return <TypeParameterBody>{reflection.name}</TypeParameterBody>
	}
}

const TypeParameterBody = styled.span``
