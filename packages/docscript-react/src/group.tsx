import React from 'react'
import { Reflection, ReflectionKind } from '@docscript/reflector/src/reflection/reflection'
import { Section } from './ui/section'
import { RefLink } from './ref-link'
import { key } from './helpers'

export const SectionNames = {
	[ReflectionKind.Interface]: 'Interfaces',
	[ReflectionKind.Class]: 'Classes',
	[ReflectionKind.TypeAlias]: 'Type Aliases',
	[ReflectionKind.Function]: 'Functions',
	[ReflectionKind.Variable]: 'Variables',
	getName(group: string) {
		return this[group] || group
	}
}

export type GroupedReflections = { [key: string]: Reflection[] }

export interface GroupViewProps {
	groups: GroupedReflections
}

export class GroupView extends React.Component<GroupViewProps> {
	static groupReflections = groupReflections
	static SectionNames = SectionNames

	render() {
		let { groups } = this.props

		return (
			<div>
				{Object.keys(groups).map(group => {
					let reflections = groups[group]
					let name = SectionNames.getName(group)
					return (
						<Section key={group} heading={<h2 id={name}>{name}</h2>}>
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
