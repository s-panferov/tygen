import * as React from 'react'

import { TupleReflection } from '@tygen/reflector'
import { ReflectionPre } from '../index'
import { Join } from '../../ui/join'
import { PrettyCode } from '../prettier'
import { getKey } from '../../ref-link'

export class TuplePre extends PrettyCode<{ reflection: TupleReflection }> {
	render() {
		const { reflection } = this.props

		return (
			<React.Fragment>
				[
				<Join joinWith=",">
					{reflection.types.map((ty, i) => (
						<ReflectionPre key={getKey(ty) || `ty-${i}`} reflection={ty} />
					))}
				</Join>
				]
			</React.Fragment>
		)
	}
}
