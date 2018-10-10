import * as React from 'react'

import { ReflectionPre } from '../index'
import { ConditionalTypeReflection } from '@tygen/reflector'
import { PrettyCode } from '../prettier'

export class ConditionalTypePre extends PrettyCode<{ reflection: ConditionalTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				<ReflectionPre reflection={reflection.checkType} /> extends{' '}
				<ReflectionPre reflection={reflection.extendsType} />?{' '}
				{reflection.trueType && <ReflectionPre reflection={reflection.trueType} />}:{' '}
				{reflection.falseType && <ReflectionPre reflection={reflection.falseType} />}
			</React.Fragment>
		)
	}
}
