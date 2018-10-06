import * as React from 'react'

import { TypePre } from '.'
import { IndexTypeReflection } from '@tygen/reflector'
import { PrettyCode } from '../prettier'

export class IndexTypePre extends PrettyCode<{ reflection: IndexTypeReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				keyof <TypePre reflection={reflection.type} />
			</React.Fragment>
		)
	}
}
