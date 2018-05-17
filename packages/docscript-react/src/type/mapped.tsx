import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { MappedTypeReflection } from '@docscript/reflector/src/reflection/_type/mapped/reflection'
import { RefLink } from '../ref-link'
import { TypeView } from '../type'

export class MappedView extends BaseView<MappedTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<MappedBody>
				{'{ '}
				[{<RefLink reflection={reflection.typeParameter} />} extends{' '}
				{<RefLink reflection={reflection.constraintType} />}]:{' '}
				<TypeView reflection={reflection.templateType} /> {'}'}
			</MappedBody>
		)
	}
}

const MappedBody = styled.span``
