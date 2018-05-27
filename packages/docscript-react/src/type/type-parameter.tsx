import * as React from 'react'
import { css, styles } from 'linaria'

import { BaseView } from '../view'
import { TypeParameterReflection } from '@docscript/reflector/src/reflection/type-parameter/reflection'

export class TypeParameterView extends BaseView<TypeParameterReflection> {
	render() {
		const { reflection } = this.props
		return <span {...styles(TypeParameterBody)}>{reflection.name}</span>
	}
}

const TypeParameterBody = css``
