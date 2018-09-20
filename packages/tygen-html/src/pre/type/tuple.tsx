import * as React from 'react'

import { TupleReflection } from '@tygen/reflector/src/reflection/_type/tuple/reflection'
import { TypePre } from '.'
import { Join } from '../../ui/join'
import { PrettyCode } from '../prettier'

export class TuplePre extends PrettyCode<{ reflection: TupleReflection }> {
	render() {
		const { reflection } = this.props

		return (
			<React.Fragment>
				[
				<Join joinWith=",">
					{reflection.types.map((ty, i) => (
						<TypePre key={ty.id || `ty-${i}`} reflection={ty} />
					))}
				</Join>
				]
			</React.Fragment>
		)
	}
}
