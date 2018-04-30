import * as React from 'react'

import { BaseView } from '../view'
import {
	IntersectionTypeReflection,
	UnionTypeReflection
} from '@docscript/reflector/src/reflection/_type/intersection/reflection'
import { TypeView } from '../type'
import { TypeKind } from '@docscript/reflector/src/reflection/_type/reflection'
import styled from 'styled-components'
import cn from 'classnames'

export class IntersectionTypeView extends BaseView<
	IntersectionTypeReflection | UnionTypeReflection
> {
	render() {
		const { reflection } = this.props
		const sep = reflection.typeKind === TypeKind.Intersection ? '&' : '|'
		const long = reflection.types.length > 5
		return (
			<IntersectionBody className={cn({ long })}>
				{reflection.types.map((type, i) => {
					return (
						<span key={type.id || `${type}-${i}`}>
							{(long || i !== 0) && <Sep>{sep}</Sep>}
							<TypeView reflection={type} />
						</span>
					)
				})}
			</IntersectionBody>
		)
	}
}

const Sep = styled.span`
	padding: 0 2px;
	color: #ccc;
`

const IntersectionBody = styled.span`
	&.long {
		display: flex;
		margin-left: 10px;
		flex-direction: column;
	}
`
