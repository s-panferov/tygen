import * as React from 'react'

import {
	IntersectionTypeReflection,
	UnionTypeReflection
} from '@tygen/reflector/src/reflection/_type/intersection/reflection'

import { TypePre } from '.'
import { TypeKind } from '@tygen/reflector/src/reflection/_type/reflection'
import { PrettyCode } from '../prettier'
import { Join } from '../../ui/join'

export class IntersectionTypePre extends PrettyCode<{
	reflection: IntersectionTypeReflection | UnionTypeReflection
}> {
	render() {
		const { reflection } = this.props
		const sep = reflection.typeKind === TypeKind.Intersection ? '&' : '|'

		return (
			<React.Fragment>
				<Join joinWith={sep}>
					{reflection.types.map(type => (
						<TypePre reflection={type} />
					))}
				</Join>
			</React.Fragment>
		)
	}
}
