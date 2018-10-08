import * as React from 'react'

import { IntersectionTypeReflection, UnionTypeReflection, ReflectionKind } from '@tygen/reflector'

import { TypePre } from '.'
import { PrettyCode } from '../prettier'
import { Join } from '../../ui/join'

export class IntersectionTypePre extends PrettyCode<{
	reflection: IntersectionTypeReflection | UnionTypeReflection
}> {
	render() {
		const { reflection } = this.props
		const sep = reflection.kind === ReflectionKind.IntersectionType ? '&' : '|'

		return (
			<React.Fragment>
				<Join joinWith={sep}>
					{reflection.types.map((type, i) => (
						<TypePre key={type.id || i} reflection={type} />
					))}
				</Join>
			</React.Fragment>
		)
	}
}
