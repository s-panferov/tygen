import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from './view'
import { NotIncludedReflection } from '@tygen/reflector'
import { PrettyCode } from './pre/prettier'

export class NotIncluded extends BaseView<NotIncludedReflection> {
	render() {
		const { reflection } = this.props
		return <span className={NotIncludedStyle}>{reflection.name}</span>
	}
}

export class NotIncludedPre extends PrettyCode<{ reflection: NotIncludedReflection }> {
	render() {
		const { reflection } = this.props
		return reflection.name
	}
}

const NotIncludedStyle = css``
