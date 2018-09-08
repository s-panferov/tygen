import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from '../view'
import { ThisReflection } from '@tygen/reflector/src/reflection/_type/this/reflection'
import { RefLink } from '../ref-link'

export class ThisView extends BaseView<ThisReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span className={ThisBody}>
				{reflection.base ? <RefLink name={'this'} reflection={reflection.base} /> : 'this'}
			</span>
		)
	}
}

const ThisBody = css`
	font-family: var(--monospace-font);
`
