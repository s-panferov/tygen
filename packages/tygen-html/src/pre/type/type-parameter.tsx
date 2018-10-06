import * as React from 'react'

import { TypeParameterReflection } from '@tygen/reflector'
import { PrettyCode } from '../prettier'
import { RefLink } from '../../ref-link'

export class TypeParameterPre extends PrettyCode<{ reflection: TypeParameterReflection }> {
	render() {
		const { reflection } = this.props
		return this.id(reflection.name, <RefLink reflection={reflection} />)
	}
}
