import * as React from 'react'

import { TypeParameterReflection } from '@tygen/reflector'
import { PrettyCode } from '../prettier'
import { RefLink } from '../../ref-link'
import { ReflectionPre } from '..'

export class TypeParameterPre extends PrettyCode<{ reflection: TypeParameterReflection }> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{this.id(reflection.name, <RefLink reflection={reflection} />)}
				{reflection.constraint && (
					<React.Fragment>
						{' '}
						extends{' '}
						<ReflectionPre key="constraint" reflection={reflection.constraint} />
					</React.Fragment>
				)}
				{reflection.default && (
					<React.Fragment>
						= <ReflectionPre key="constraint" reflection={reflection.default} />
					</React.Fragment>
				)}
			</React.Fragment>
		)
	}
}
