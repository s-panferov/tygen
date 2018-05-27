import * as React from 'react'
import { css, styles } from 'linaria'

import { BaseView } from '../view'
import { TupleReflection } from '@docscript/reflector/src/reflection/_type/tuple/reflection'
import { TypeView } from '../type'
import { Join } from '../ui/join'

export class TupleView extends BaseView<TupleReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span {...styles(TupleBody)}>
				[
				<Join joinWith={i => <span key={i}>, </span>}>
					{reflection.types.map((ty, i) => (
						<TypeView key={ty.id || `ty-${i}`} reflection={ty} />
					))}
				</Join>
				]
			</span>
		)
	}
}

const TupleBody = css``
