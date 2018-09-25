import * as React from 'react'
import { PackageReflection } from '@tygen/reflector/src/reflection'
import { Markdown } from './ui/markdown'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { BaseView } from './view'
import { Breadcrumb } from './breadcrumb'
import { css } from 'linaria'
import { Icon } from './ui/icon'
import { Outline } from './ui/outline'

import PackageIcon from '@fortawesome/fontawesome-free/svgs/solid/cube.svg'
import BookIcon from '@fortawesome/fontawesome-free/svgs/brands/markdown.svg'
import { Structure, createStructure } from './structure'
import { Tree } from './tree'

export class PackagePage extends BaseView<PackageReflection> {
	tree = (console.log(1), new Tree(createStructure(this.props.reflection)))

	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const structure = <Structure tree={this.tree} />

		return (
			<div className={BodyStyle}>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout
					sidebar={[structure]}
					breadcrumb={<Breadcrumb reflection={reflection} />}
					header={
						<Outline
							icon={<Icon width={20} height={20} sym={PackageIcon} />}
							header={<h1>{reflection.manifest.name}</h1>}
						/>
					}>
					<Outline header={<h2>README</h2>} icon={<Icon sym={BookIcon} />}>
						<Markdown source={reflection.readme || 'The package has no README'} />
					</Outline>
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
