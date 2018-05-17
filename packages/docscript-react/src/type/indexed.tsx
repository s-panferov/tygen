import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { TypeView } from '../type'
import { IndexedAccessReflection } from '@docscript/reflector/src/reflection/_type/indexed-access/reflection'

export class IndexedAccessView extends BaseView<IndexedAccessReflection> {
	render() {
		const { reflection } = this.props
		return (
			<IndexedAccessBody>
				<TypeView reflection={reflection.objectType} />
				{'['}
				<TypeView reflection={reflection.indexType} />
				{']'}
			</IndexedAccessBody>
		)
	}
}

const IndexedAccessBody = styled.span``
