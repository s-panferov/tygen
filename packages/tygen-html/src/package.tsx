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
import { css } from 'linaria'

export class PackagePage extends BaseView<PackageReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const structure = renderStructure(reflection)

		return (
			<div className={BodyStyle}>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout
					sidebar={[structure]}
					header={
						<h1>
							{reflection.manifest.name} <Badge>Package</Badge>
						</h1>
					}
					breadcrumb={<Breadcrumb reflection={reflection} />}>
					<Section heading="README">
						<Markdown source={reflection.readme || 'The package has no README'} />
					</Section>
				</Layout>
			</div>
		)
	}
}

const BodyStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
`
