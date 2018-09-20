import * as React from 'react'

import { MappedTypeReflection } from '@tygen/reflector/src/reflection/_type/mapped/reflection'
import { RefLink } from '../../ref-link'
import { TypePre } from '.'
import { PrettyCode } from '../prettier'

export class MappedTypePre extends PrettyCode<{ reflection: MappedTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{'{ '}[{<RefLink reflection={reflection.typeParameter} />} extends{' '}
				{<RefLink reflection={reflection.constraintType} />}
				]: <TypePre reflection={reflection.templateType} /> {'}'}
			</React.Fragment>
		)
	}
}
