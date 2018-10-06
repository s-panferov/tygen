import * as React from 'react'

import { BaseView } from '../../view'
import { ThisReflection } from '@tygen/reflector'
import { RefLinkPre } from '../../ref-link'

export class ThisPre extends BaseView<ThisReflection> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{reflection.base ? (
					<RefLinkPre name={'this'} reflection={reflection.base} />
				) : (
					'this'
				)}
			</React.Fragment>
		)
	}
}
