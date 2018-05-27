import * as React from 'react'
import { css, styles } from 'linaria'

import { BaseView } from '../view'
import { MappedTypeReflection } from '@tygen/reflector/src/reflection/_type/mapped/reflection'
import { RefLink } from '../ref-link'
import { TypeView } from '../type'

export class MappedView extends BaseView<MappedTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span {...styles(MappedBody)}>
				{'{ '}
				[{<RefLink reflection={reflection.typeParameter} />} extends{' '}
				{<RefLink reflection={reflection.constraintType} />}]:{' '}
				<TypeView reflection={reflection.templateType} /> {'}'}
			</span>
		)
	}
}

const MappedBody = css``
