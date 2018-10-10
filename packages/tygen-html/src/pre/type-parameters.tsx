import React from 'react'
import { Join } from '../ui/join'
import { TypeReflection } from '@tygen/reflector'
import { TypePre } from './type'
import { PrettyCode } from './prettier'
import { getKey } from '../ref-link'

export class TypeArgumentsPre extends PrettyCode<{ types: TypeReflection[] }> {
	render() {
		const { types } = this.props

		return (
			<React.Fragment>
				{'<'}
				<Join joinWith=",">
					{types.map((ty, i) => (
						<TypePre key={getKey(ty) || `ty${i}`} reflection={ty} />
					))}
				</Join>
				{'>'}
			</React.Fragment>
		)
	}
}
