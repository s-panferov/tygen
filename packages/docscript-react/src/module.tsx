import * as React from 'react'
import {
	ESModuleReflection,
	ModuleReflection,
	NamespaceReflection
} from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView, withContext, ViewContext } from './view'
import { Nav } from './ui/nav'
import { Breadcrumb } from './breadcrumb'
import { ExportsView } from './exports'

@withContext
export class ModulePage extends BaseView<
	ESModuleReflection | ModuleReflection | NamespaceReflection
> {
	render() {
		const { reflection, settings } = this.props
		const ident = parseId(reflection.id!)

		const nav = (
			<ViewContext.Provider value={Object.assign({}, settings!, { nav: true })}>
				<ExportsView reflection={reflection} />
			</ViewContext.Provider>
		)

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
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
