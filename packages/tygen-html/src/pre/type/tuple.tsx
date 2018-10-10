import * as React from 'react'

import { TupleReflection } from '@tygen/reflector'
import { TypePre } from '.'
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
						<TypePre key={getKey(ty) || `ty-${i}`} reflection={ty} />
					))}
				</Join>
				]
			</React.Fragment>
		)
	}
}
