import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { TypeView } from '../type'
import { IndexTypeReflection } from '@docscript/reflector/src/reflection/_type/index-type/reflection'

export class IndexTypeView extends BaseView<IndexTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<IndexTypeBody>
				keyof <TypeView reflection={reflection.type} />
			</IndexTypeBody>
		)
	}
}

const IndexTypeBody = styled.span``
