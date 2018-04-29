import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { TypeReferenceReflection } from '@docscript/reflector/src/reflection/_type/reference/reflection'
import { TypeView } from '../type'
import { TypeArguments } from '../type-parameters'

export class TypeReferenceView extends BaseView<TypeReferenceReflection> {
	render() {
		const { reflection } = this.props
		return (
			<TypeReferenceBody>
				<TypeView reflection={reflection.target} />
				{reflection.typeArguments && <TypeArguments types={reflection.typeArguments} />}
			</TypeReferenceBody>
		)
	}
}

const TypeReferenceBody = styled.span``
