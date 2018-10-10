import * as React from 'react'

import { BaseView } from '../../view'
import { TypeReferenceReflection } from '@tygen/reflector'
import { TypePre } from '.'
import { TypeArgumentsPre } from '../type-parameters'

export class TypeReferencePre extends BaseView<TypeReferenceReflection> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				<TypePre reflection={reflection.target} />
				{reflection.typeArguments && <TypeArgumentsPre types={reflection.typeArguments} />}
			</React.Fragment>
		)
	}
}
