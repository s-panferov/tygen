import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from './view'
import { NotIncludedReflection } from '@tygen/reflector/src/reflection'

export class NotIncluded extends BaseView<NotIncludedReflection> {
	render() {
		const { reflection } = this.props
		return <span className={NotIncludedStyle}>{reflection.name}</span>
	}
}

const NotIncludedStyle = css``
