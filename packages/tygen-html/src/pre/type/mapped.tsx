import * as React from 'react'

import { MappedTypeReflection } from '@tygen/reflector'
import { TypePre } from '.'
import { PrettyCode } from '../prettier'

export class MappedTypePre extends PrettyCode<{ reflection: MappedTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{'{ '}[{<TypePre reflection={reflection.typeParameter} />} extends{' '}
				{<TypePre reflection={reflection.constraintType} />}
				]: <TypePre reflection={reflection.templateType} /> {'}'}
			</React.Fragment>
		)
	}
}
