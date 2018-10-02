import * as React from 'react'

import { BaseView } from './view'
import { ReflectionWithExports } from '@tygen/reflector/src/reflection'
import { GroupView } from './group'

export class ExportsView extends BaseView<ReflectionWithExports> {
	render() {
		const { reflection } = this.props

		const groups = GroupView.groupReflections(reflection.exports || [])
		return <GroupView groups={groups} />
	}
}
