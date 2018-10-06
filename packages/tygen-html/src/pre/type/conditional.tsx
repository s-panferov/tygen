import * as React from 'react'

import { TypePre } from '.'
import { ConditionalTypeReflection } from '@tygen/reflector'
import { PrettyCode } from '../prettier'

export class ConditionalTypePre extends PrettyCode<{ reflection: ConditionalTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				<TypePre reflection={reflection.checkType} /> extends{' '}
				<TypePre reflection={reflection.extendsType} />?{' '}
				{reflection.trueType && <TypePre reflection={reflection.trueType} />}:{' '}
				{reflection.falseType && <TypePre reflection={reflection.falseType} />}
			</React.Fragment>
		)
	}
}
