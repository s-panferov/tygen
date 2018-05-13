import * as React from 'react'

import { withContext, BaseView } from './view'
import { ReflectionWithExports } from '@docscript/reflector/src/reflection'
import { GroupView } from './group'
import { Nav } from './ui/nav'

@withContext
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
