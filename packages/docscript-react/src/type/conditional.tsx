import * as React from 'react'
import { css, styles } from 'linaria'

import { BaseView } from '../view'
import { TypeView } from '../type'
import { ConditionalTypeReflection } from '@docscript/reflector/src/reflection/_type/conditional/reflection'

export class ConditionalView extends BaseView<ConditionalTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<span {...styles(ConditionalBody)}>
				<TypeView reflection={reflection.checkType} /> extends{' '}
				<TypeView reflection={reflection.extendsType} />
				<div {...styles(TrueBody)}>
					? {reflection.trueType && <TypeView reflection={reflection.trueType} />}
				</div>
				<div {...styles(FalseBody)}>
					: {reflection.falseType && <TypeView reflection={reflection.falseType} />}
				</div>
			</span>
		)
	}
}

const ConditionalBody = css``
const TrueBody = css`
	padding-left: 20px;
`

const FalseBody = css`
	padding-left: 20px;
`
