import * as React from 'react'
import { Page } from './ui/layout'

import {
	ESModuleReflection,
	AmbientModuleReflection,
	NamespaceReflection,
	DeclarationFileReflection
} from '@tygen/reflector'

import { BaseView } from './view'
import { Outline } from './ui/outline'
import { TSIcon } from './ui/icon'
import { NavTree } from './ui/tree-render'
import { buildTreeByType } from './group'
import { Structure } from './structure'

export class ModulePage extends BaseView<
	ESModuleReflection | AmbientModuleReflection | NamespaceReflection | DeclarationFileReflection
> {
	tree = new NavTree(buildTreeByType(this.props.reflection.exports || []))

	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={
					<Outline
						icon={<TSIcon className="tsd-kind-module" />}
						header={<h1>Module {reflection.name}</h1>}
					/>
				}>
				<Structure wide tree={this.tree} />
			</Page>
		)
	}
}
