import * as React from 'react'

import { MappedTypeReflection } from '@tygen/reflector'
import { ReflectionPre } from '../index'
import { PrettyCode } from '../prettier'

export class MappedTypePre extends PrettyCode<{ reflection: MappedTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{'{ '}[{<ReflectionPre reflection={reflection.typeParameter} />} in{' '}
				{<ReflectionPre reflection={reflection.constraintType} />}
				]: <ReflectionPre reflection={reflection.templateType} /> {'}'}
			</React.Fragment>
		)
	}
}
