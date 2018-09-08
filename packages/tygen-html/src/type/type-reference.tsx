import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from '../view'
import { TypeReferenceReflection } from '@tygen/reflector/src/reflection/_type/reference/reflection'
import { TypeView } from '../type'
import { TypeArguments } from '../type-parameters'

export class TypeReferenceView extends BaseView<TypeReferenceReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span className={TypeReferenceBody}>
				<TypeView reflection={reflection.target} />
				{reflection.typeArguments && <TypeArguments types={reflection.typeArguments} />}
			</span>
		)
	}
}

const TypeReferenceBody = css``
