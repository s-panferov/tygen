import * as React from 'react'

import { ReflectionPre } from '../index'
import { IndexTypeReflection } from '@tygen/reflector'
import { PrettyCode } from '../prettier'

export class IndexTypePre extends PrettyCode<{ reflection: IndexTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				keyof <ReflectionPre reflection={reflection.type} />
			</React.Fragment>
		)
	}
}
