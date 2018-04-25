import React from 'react'
import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection/reflection'
import { Section } from './section'
import { RefLink } from './ref-link'
import { key } from './helper'

export type GroupedReflections = { [key: string]: Reflection[] }

export interface GroupViewProps {
	groups: GroupedReflections
}

export class GroupView extends React.Component<GroupViewProps> {
	static groupReflections = groupReflections

	render() {
		let { groups } = this.props

		return (
			<div>
				{Object.keys(groups).map(group => {
					let reflections = groups[group]
					return (
						<Section key={group} heading={group}>
							<Section.Grid>
								{reflections.map(module => {
									return <RefLink key={key(module)} reflection={module} />
								})}
							</Section.Grid>
						</Section>
					)
				})}
			</div>
		)
	}
}

export function groupReflections(reflections: Reflection[]): GroupedReflections {
	let groups: GroupedReflections = {}
	reflections.forEach(ref => {
		let kind = ref.kind
		if (ref.kind === ReflectionKind.Link) {
			kind = ref.targetKind
		}

		if (!groups[kind]) {
			groups[kind] = []
		}

		groups[kind].push(ref)
	})

	return groups
}
