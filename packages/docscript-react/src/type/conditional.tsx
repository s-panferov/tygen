import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { TypeView } from '../type'
import { ConditionalTypeReflection } from '@docscript/reflector/src/reflection/_type/conditional/reflection'

export class ConditionalView extends BaseView<ConditionalTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<ConditionalBody>
				<TypeView reflection={reflection.checkType} /> extends{' '}
				<TypeView reflection={reflection.extendsType} />
				<TrueBody>
					? {reflection.trueType && <TypeView reflection={reflection.trueType} />}
				</TrueBody>
				<FalseBody>
					: {reflection.falseType && <TypeView reflection={reflection.falseType} />}
				</FalseBody>
			</ConditionalBody>
		)
	}
}

const ConditionalBody = styled.span``
const TrueBody = styled.div`
	padding-left: 20px;
`
const FalseBody = styled.div`
	padding-left: 20px;
`
