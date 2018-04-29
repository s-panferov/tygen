import * as React from 'react'
import { Markdown } from './ui/markdown'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { Section } from './ui/section'
import { RefLink } from './ref-link'
import { BaseView } from './view'
import { key } from './helpers'
import { Nav } from './ui/nav'
import {
	ReflectionWithStructure,
	FolderReflection
} from '../../docscript-reflector/src/reflection/package'
import { Breadcrumb } from './breadcrumb'

export function renderStructure(reflection: ReflectionWithStructure) {
	return (
		<Nav key="nav">
			<Nav.Section heading="Structure">
				{reflection.modules.map(module => {
					return (
						<Nav.Item key={key(module)}>
							<RefLink reflection={module} relativeId={reflection.id} />
						</Nav.Item>
					)
				})}
			</Nav.Section>
		</Nav>
	)
}

export class FolderPage extends BaseView<FolderReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const structure = renderStructure(reflection)

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={[structure]}>
					<h1>
						{reflection.name} <Badge>Folder</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<Section heading="README">
						<Markdown source={reflection.readme || 'The folder has no README'} />
					</Section>
				</Layout>
			</div>
		)
	}
}
