import * as React from 'react'

import { withSettings, BaseView } from './view'
import { ReflectionWithExports } from '@tygen/reflector/src/reflection'
import { GroupView } from './group'
import { Nav } from './ui/nav'

@withSettings
export class ExportsView extends BaseView<ReflectionWithExports> {
	render() {
		const { reflection, settings } = this.props
		const { nav } = settings!

		const groups = GroupView.groupReflections(reflection.exports || [])

		if (nav) {
			return (
				<Nav.Section heading="Exports">
					{Object.keys(groups).map(group => {
						const name = GroupView.SectionNames.getName(group)
						return (
							<Nav.Item key={group}>
								<a className="phantom" href={`#${name}`}>
									{name}
								</a>
							</Nav.Item>
						)
					})}
				</Nav.Section>
			)
		} else {
			return <GroupView groups={groups} />
		}
	}
}
