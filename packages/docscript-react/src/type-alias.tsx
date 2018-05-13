import * as React from 'react'
import { TypeAliasReflection } from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView, withContext, ViewContext } from './view'
import { CommentView } from './comment'
import { Breadcrumb } from './breadcrumb'
import { TypeArguments } from './type-parameters'
import { TypeView } from './type'
import styled from 'styled-components'
import { ExportsView } from './exports'

@withContext
export class TypeAliasPage extends BaseView<TypeAliasReflection> {
	render() {
		const { reflection, settings } = this.props
		const { nav } = settings!

		const ident = parseId(reflection.id!)
		const sections = [] as React.ReactNode[]

		if (reflection.exports) {
			sections.push(<ExportsView key="exports" reflection={reflection} />)
		}

		if (nav) {
			return sections
		}

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout
					sidebar={
						<ViewContext.Provider value={Object.assign({}, settings, { nav: true })} />
					}>
					<h1>
						{reflection.name}
						{reflection.typeParameters && (
							<TypeArguments types={reflection.typeParameters} />
						)}{' '}
						<Badge>TypeAlias</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<TypeAliasBody>
						<TypeAliasName>{reflection.name}</TypeAliasName>
						{reflection.typeParameters && (
							<TypeArguments types={reflection.typeParameters} />
						)}{' '}
						= <TypeView reflection={reflection.type} />
					</TypeAliasBody>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

const TypeAliasName = styled.span`
	color: #2e86de;
	font-weight: bold;
`

const TypeAliasBody = styled.span`
	font-family: monospace;
`
