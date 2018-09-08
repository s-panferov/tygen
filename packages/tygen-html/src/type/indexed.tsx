import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from '../view'
import { TypeView } from '../type'
import { IndexedAccessReflection } from '@tygen/reflector/src/reflection/_type/indexed-access/reflection'

export class IndexedAccessView extends BaseView<IndexedAccessReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span className={IndexedAccessBody}>
				<TypeView reflection={reflection.objectType} />
				{'['}
				<TypeView reflection={reflection.indexType} />
				{']'}
			</span>
		)
	}
}

const IndexedAccessBody = css``
