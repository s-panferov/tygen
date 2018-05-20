import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { ThisReflection } from '@docscript/reflector/src/reflection/_type/this/reflection'
import { RefLink } from '../ref-link'

export class ThisView extends BaseView<ThisReflection> {
	render() {
		const { reflection } = this.props
		return (
			<ThisBody>
				{reflection.base ? <RefLink name={'this'} reflection={reflection.base} /> : 'this'}
			</ThisBody>
		)
	}
}

const ThisBody = styled.span`
	font-family: monospace;
`
