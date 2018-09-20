import * as React from 'react'

import { BaseView } from '../../view'
import { ThisReflection } from '@tygen/reflector/src/reflection/_type/this/reflection'
import { RefLink } from '../../ref-link'

export class ThisView extends BaseView<ThisReflection> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{reflection.base ? <RefLink name={'this'} reflection={reflection.base} /> : 'this'}
			</React.Fragment>
		)
	}
}
