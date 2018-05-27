import * as React from 'react'
import { PackageReflection } from '@tygen/reflector/src/reflection'
import { Markdown } from './ui/markdown'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { Section } from './ui/section'
import { BaseView } from './view'
import { renderStructure } from './folder'
import { Breadcrumb } from './breadcrumb'

export class PackagePage extends BaseView<PackageReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const structure = renderStructure(reflection)

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={[structure]}>
					<h1>
						{reflection.manifest.name} <Badge>Package</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<Section heading="README">
						<Markdown source={reflection.readme || 'The package has no README'} />
					</Section>
				</Layout>
			</div>
		)
	}
}
