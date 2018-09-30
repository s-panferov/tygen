import * as React from 'react'
import { Header } from './ui/header'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView, withSettings, ViewContext } from './view'
import { Nav } from './ui/nav'
import { Breadcrumb } from './breadcrumb'
import { ExportsView } from './exports'

import {
	ESModuleReflection,
	ModuleReflection,
	NamespaceReflection,
	AmbientFileReflection
} from '@tygen/reflector/src/reflection'

export class ModulePage extends BaseView<
	ESModuleReflection | ModuleReflection | NamespaceReflection | AmbientFileReflection
> {
	render() {
		const { reflection, settings } = this.props
		const ident = parseId(reflection.id!)

		return (
			<div>
				<Header pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={<Nav>{nav}</Nav>}>
					<h1>
						{reflection.name} <Badge>Module</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<ExportsView reflection={reflection} />
				</Layout>
			</div>
		)
	}
}
