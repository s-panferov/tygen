import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from '../view'
import { TypeView } from '../type'
import { IndexTypeReflection } from '@tygen/reflector/src/reflection/_type/index-type/reflection'

export class IndexTypeView extends BaseView<IndexTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span className={IndexTypeBody}>
				keyof <TypeView reflection={reflection.type} />
			</span>
		)
	}
}

const IndexTypeBody = css``
