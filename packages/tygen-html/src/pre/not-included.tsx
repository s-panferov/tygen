import React from 'react'

import { NotIncludedReflection } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { formatLink } from '../ref-link'

export class NotIncludedPre extends PrettyCode<{ reflection: NotIncludedReflection }> {
	render() {
		const { reflection } = this.props
		const name = formatLink(reflection).name
		return this.id(name, <span style={{ opacity: 0.3 }}>{name}</span>)
	}
}
