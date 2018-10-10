import * as React from 'react'
import { IndexedAccessReflection } from '@tygen/reflector'

import { ReflectionPre } from '../index'
import { PrettyCode } from '../prettier'

export class IndexedAccessPre extends PrettyCode<{ reflection: IndexedAccessReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				<ReflectionPre reflection={reflection.objectType} />
				{'['}
				<ReflectionPre reflection={reflection.indexType} />
				{']'}
			</React.Fragment>
		)
	}
}
