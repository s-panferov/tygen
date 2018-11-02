import * as React from 'react'
import { FolderReflection } from '@tygen/reflector'
import { Page } from './ui/layout'
import { BaseView } from './view'
import { Outline } from './ui/outline'

import { StructureItem, Structure } from './structure'
import { NavTree } from './ui/tree-render'
import { createModulesStructure } from './package'

export function createStructure(reflection: FolderReflection): StructureItem[] {
	let result = [] as StructureItem[]

	const structure = createModulesStructure(reflection)
	if (structure) {
		result.push(structure)
	}

	return result
}

export class FolderPage extends BaseView<FolderReflection> {
	tree = new NavTree(createStructure(this.props.reflection))

	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={<Outline header={<h1>Folder {reflection.name}</h1>} />}>
				<Structure tree={this.tree} />
			</Page>
		)
	}
}
