import * as React from 'react'
import { ESModuleReflection } from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView } from './view'
import { GroupView } from './group'
import { Nav } from './ui/nav'
import { Breadcrumb } from './breadcrumb'

export class ModulePage extends BaseView<ESModuleReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const groups = GroupView.groupReflections(reflection.exports || [])

		const sections = (
			<Nav>
				<Nav.Section heading="Structure">
					{Object.keys(groups).map(group => {
						const name = GroupView.SectionNames.getName(group)
						return (
							<Nav.Item key={group}>
								<a href={`#${name}`}>{name}</a>
							</Nav.Item>
						)
					})}
				</Nav.Section>
			</Nav>
		)

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={sections}>
					<h1>
						{reflection.name} <Badge>Module</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<GroupView groups={groups} />
				</Layout>
			</div>
		)
	}
}
