import * as React from 'react'
import { ESModuleReflection } from '@docscript/reflector/src/reflection'
import { Toolbar } from './toolbar'
import { parseId } from './helpers'
import { Layout } from './layout'
import { Badge } from './badge'
import { ReflectionView } from './view'
import { GroupView } from './group'

export class ModuleView extends ReflectionView<ESModuleReflection> {
	render() {
		let { reflection } = this.props
		let ident = parseId(reflection.id!)
		let groups = GroupView.groupReflections(reflection.exports || [])

		let sections = Object.keys(groups).map(groupName => {
			return (
				<a key={groupName} href={`#${groupName}`}>
					{groupName}
				</a>
			)
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
