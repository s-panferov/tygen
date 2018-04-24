import * as React from 'react'
import { ESModuleReflection, Reflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { Toolbar } from './toolbar'
import { parseId } from './helpers'
import { Layout } from './layout'
import { Badge } from './badge'
import { Section } from './section'
import { Link } from './link'
import { ReflectionView } from './view'
import { key } from './helper'

export type GroupedReflections = { [key: string]: Reflection[] }

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

export class ModuleView extends ReflectionView<ESModuleReflection> {
	render() {
		let { reflection } = this.props
		let ident = parseId(reflection.id!)
		let groups = groupReflections(reflection.exports || [])

		let sections = Object.keys(groups).map(groupName => {
			return <a href={`#${groupName}`}>{groupName}</a>
		})

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={sections}>
					<h1>
						{reflection.name} <Badge>Module</Badge>
					</h1>
					<GroupView groups={groups} />
				</Layout>
			</div>
		)
	}
}

export interface GroupViewProps {
	groups: GroupedReflections
}

export class GroupView extends React.Component<GroupViewProps> {
	render() {
		let { groups } = this.props

		return (
			<div>
				{Object.keys(groups).map(group => {
					let reflections = groups[group]
					return (
						<Section key={group} heading={group}>
							{reflections.map(module => {
								return <Link key={key(module)} reflection={module} />
							})}
						</Section>
					)
				})}
			</div>
		)
	}
}
