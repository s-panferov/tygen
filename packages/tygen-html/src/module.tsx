import * as React from 'react'
import { Page } from './ui/layout'

import {
	ESModuleReflection,
	ModuleReflection,
	NamespaceReflection,
	AmbientFileReflection
} from '@tygen/reflector/src/reflection'

import { BaseView } from './view'
import { Outline } from './ui/outline'
import { TSIcon } from './ui/icon'
import { GroupView } from './group'

export class ModulePage extends BaseView<
	ESModuleReflection | ModuleReflection | NamespaceReflection | AmbientFileReflection
> {
	render() {
		const { reflection } = this.props
		const groups = GroupView.groupReflections(reflection.exports || [])

		return (
			<Page
				short
				reflection={reflection}
				header={
					<Outline
						icon={<TSIcon className="tsd-kind-module" />}
						header={<h1>{reflection.name}</h1>}
					/>
				}>
				<GroupView groups={groups} />
			</Page>
		)
	}
}
