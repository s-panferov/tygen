import * as React from 'react'
import { PackageReflection, ReflectionKind } from '@tygen/reflector'
import { Markdown } from './ui/markdown'
import { Page } from './ui/layout'
import { BaseView } from './view'
import { Icon } from './ui/icon'
import { Outline } from './ui/outline'

import PackageIcon from '@fortawesome/fontawesome-free/svgs/solid/cube.svg'
import BookIcon from '@fortawesome/fontawesome-free/svgs/brands/markdown.svg'
import { formatLink } from './ref-link'
import { Tree, TreeNavigation } from './ui/tree'
import { StructureItem, HeaderItem, LinkItem, Sidebar } from './ui/sidebar'

export function createStructure(reflection: PackageReflection): StructureItem[] {
	let result = [] as StructureItem[]

	switch (reflection.kind) {
		case ReflectionKind.Package:
			if (reflection.modules && reflection.modules.length > 0) {
				result.push(
					new HeaderItem(
						'structure',
						{
							text: 'Structure',
							kind: 'header' as 'header'
						},
						reflection.modules.map(mod => {
							const link = formatLink(mod)
							return new LinkItem(link.href, {
								kind: 'link',
								text: link.name,
								href: link.href
							})
						})
					)
				)
			}

			if (reflection.exports && reflection.exports.length > 0) {
				result.push(
					new HeaderItem(
						'exports',
						{
							text: 'Exports',
							kind: 'header'
						},
						reflection.exports.map(mod => {
							const link = formatLink(mod)
							return new LinkItem(link.href, {
								kind: 'link',
								text: link.name,
								href: link.href
							})
						})
					)
				)
			}
	}

	return result
}

export class PackagePage extends BaseView<PackageReflection> {
	tree = new Tree(createStructure(this.props.reflection), tree => ({
		nav: new TreeNavigation(tree)
	}))

	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				sidebar={<Sidebar tree={this.tree} />}
				header={
					<Outline
						icon={<Icon width={20} height={20} sym={PackageIcon} />}
						header={<h1>{reflection.manifest.name}</h1>}
					/>
				}>
				<Outline header={<h2>README</h2>} icon={<Icon sym={BookIcon} />}>
					<Markdown source={reflection.readme || 'The package has no README'} />
				</Outline>
			</Page>
		)
	}
}
