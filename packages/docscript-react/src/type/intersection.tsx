import * as React from 'react'

import { ReflectionView } from '../view'
import {
	IntersectionTypeReflection,
	UnionTypeReflection
} from '@docscript/reflector/src/reflection/_type/intersection/reflection'
import { TypeView } from '../type'
import { TypeKind } from '@docscript/reflector/src/reflection/_type/reflection'
import styled from 'styled-components'

export class Join extends React.Component<{
	joinWith: (i: number, prev: React.ReactNode) => React.ReactNode
}> {
	render() {
		const { children, joinWith } = this.props
		const array = React.Children.toArray(children)
		const result = [] as React.ReactNode[]

		array.forEach((value, i) => {
			result.push(value)
			if (i !== array.length - 1) {
				result.push(joinWith(i, value))
			}
		})

		return result
	}
}

export class IntersectionTypeView extends ReflectionView<
	IntersectionTypeReflection | UnionTypeReflection
> {
	render() {
		const { reflection } = this.props
		const sep = reflection.typeKind === TypeKind.Intersection ? '&' : '|'
		return (
			<Join joinWith={i => <Sep key={i}>{sep}</Sep>}>
				{reflection.types.map((type, i) => {
					return <TypeView key={type.id || `${type}-${i}`} reflection={type} />
				})}
			</Join>
		)
	}
}

const Sep = styled.span`
	padding: 0 2px;
`
