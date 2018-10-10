import * as React from 'react'

import { TypeAliasReflection } from '@tygen/reflector'
import { ReflectionPre } from './index'
import { PrettyCode } from './prettier'
import { TypeArgumentsPre } from './type/type-arguments'

export class TypeAliasPre extends PrettyCode<{ reflection: TypeAliasReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				type {reflection.name}
				{reflection.typeParameters &&
					reflection.typeParameters.length > 0 && (
						<React.Fragment>
							{'<'}
							<TypeArgumentsPre types={reflection.typeParameters} />
							{'>'}
						</React.Fragment>
					)}
				= <ReflectionPre reflection={reflection.type} />
			</React.Fragment>
		)
	}
}
