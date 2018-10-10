import * as React from 'react'

import { BaseView } from '../../view'
import { TypeReferenceReflection } from '@tygen/reflector'
import { ReflectionPre } from '../index'
import { TypeArgumentsPre } from '../type-parameters'

export class TypeReferencePre extends BaseView<TypeReferenceReflection> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				<ReflectionPre reflection={reflection.target} />
				{reflection.typeArguments && <TypeArgumentsPre types={reflection.typeArguments} />}
			</React.Fragment>
		)
	}
}
