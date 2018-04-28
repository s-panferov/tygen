import * as React from 'react'
import { PackageReflection } from '@docscript/reflector/src/reflection'
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

export class PackageView extends BaseView<PackageReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const modules = (
			<Nav key="nav">
				<Nav.Section heading="Structure">
					{reflection.modules.map(module => {
						return (
							<Nav.Item key={key(module)}>
								<RefLink reflection={module} />
							</Nav.Item>
						)
					})}
				</Nav.Section>
			</Nav>
		)

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={[modules]}>
					<h1>
						{reflection.manifest.name} <Badge>Package</Badge>
					</h1>
					<Section heading="README">
						<Markdown source={reflection.readme || 'The package has no README'} />
					</Section>
				</Layout>
			</div>
		)
	}
}
