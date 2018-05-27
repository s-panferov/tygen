import * as React from 'react'

import { BaseView } from '../view'
import {
	IntersectionTypeReflection,
	UnionTypeReflection
} from '@tygen/reflector/src/reflection/_type/intersection/reflection'
import { TypeView } from '../type'
import { TypeKind } from '@tygen/reflector/src/reflection/_type/reflection'
import { css, styles } from 'linaria'
import cn from 'classnames'

export class IntersectionTypeView extends BaseView<
	IntersectionTypeReflection | UnionTypeReflection
> {
	render() {
		const { reflection } = this.props
		const sep = reflection.typeKind === TypeKind.Intersection ? '&' : '|'
		const long = reflection.types.length > 5
		return (
			<span {...styles(IntersectionBody, cn({ long }))}>
				{reflection.types.map((type, i) => {
					return (
						<span key={type.id || `${type}-${i}`}>
							{(long || i !== 0) && <span {...styles(Sep)}>{sep}</span>}
							<TypeView reflection={type} />
						</span>
					)
				})}
			</span>
		)
	}
}

const Sep = css`
	padding: 0 2px;
	color: #ccc;
`

const IntersectionBody = css`
	&.long {
		display: flex;
		margin-left: 10px;
		flex-direction: column;
	}
`
