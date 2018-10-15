import * as React from 'react'
import { PackageReflection, ReflectionKind } from '@tygen/reflector'
import { Markdown } from './ui/markdown'
import { Page } from './ui/layout'
import { BaseView } from './view'
import { Icon } from './ui/icon'
import { Outline } from './ui/outline'

import PackageIcon from '@fortawesome/fontawesome-free/svgs/solid/cube.svg'
import BookIcon from '@fortawesome/fontawesome-free/svgs/brands/markdown.svg'

import { StructureItem, HeaderItem, ReflectionItem, Structure } from './structure'
import { NavTree } from './ui/tree-render'

export function createStructure(reflection: PackageReflection): StructureItem[] {
	let result = [] as StructureItem[]

	switch (reflection.kind) {
		case ReflectionKind.Package:
			if (reflection.modules && reflection.modules.length > 0) {
				result.push(
					new HeaderItem(
						'structure',
						{
							kind: 'header',
							text: 'Structure'
						},
						reflection.modules.map(ReflectionItem.fromReflection)
					)
				)
			}

			if (reflection.exports && reflection.exports.length > 0) {
				result.push(
					new HeaderItem(
						'exports',
						{
							kind: 'header',
							text: 'Exports'
						},
						reflection.exports.map(ReflectionItem.fromReflection)
					)
				)
			}
	}

	return result
}

export class PackagePage extends BaseView<PackageReflection> {
	tree = new NavTree(createStructure(this.props.reflection))

	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				sidebar={<Structure tree={this.tree} />}
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
