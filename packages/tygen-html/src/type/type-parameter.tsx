import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from '../view'
import { TypeParameterReflection } from '@tygen/reflector/src/reflection/type-parameter/reflection'

export class TypeParameterView extends BaseView<TypeParameterReflection> {
	render() {
		const { reflection } = this.props
		return <span className={TypeParameterBody}>{reflection.name}</span>
	}
}

const TypeParameterBody = css``
