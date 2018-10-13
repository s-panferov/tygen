import React from 'react'
import { Join } from '../../ui/join'
import { TypeReflection } from '@tygen/reflector'
import { ReflectionPre } from '../index'
import { PrettyCode } from '../prettier'
import { getKey } from '../../ref-link'

export class TypeArgumentsPre extends PrettyCode<{ types: TypeReflection[] | undefined }> {
	render() {
		const { types } = this.props

		if (!types || types.length === 0) {
			return null
		}

		return (
			<React.Fragment>
				{'<'}
				<Join joinWith=",">
					{types.map((ty, i) => (
						<ReflectionPre key={getKey(ty) || `ty${i}`} reflection={ty} />
					))}
				</Join>
				{'>'}
			</React.Fragment>
		)
	}
}
