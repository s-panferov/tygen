import * as React from 'react'
import { TypeAliasReflection } from '@tygen/reflector'
import { Header } from './ui/header'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView, withSettings, ViewContext } from './view'
import { CommentView } from './comment'
import { Breadcrumb } from './breadcrumb'
import { TypeArgumentsPre } from './type-parameters'
import { TypePre } from './pre/type'
import { css } from 'linaria'
import { ExportsView } from './exports'

@withSettings
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
				<Header pkg={ident.pkg} version={ident.version} />
				<Layout
					sidebar={
						<ViewContext.Provider value={Object.assign({}, settings, { nav: true })} />
					}>
					<h1>
						{reflection.name}
						{reflection.typeParameters && (
							<TypeArgumentsPre types={reflection.typeParameters} />
						)}{' '}
						<Badge>TypeAlias</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					<span className={TypeAliasBody}>
						<span className={TypeAliasName}>{reflection.name}</span>
						{reflection.typeParameters && (
							<TypeArgumentsPre types={reflection.typeParameters} />
						)}{' '}
						= <TypePre reflection={reflection.type} />
					</span>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}

const TypeAliasName = css`
	color: #2e86de;
	font-weight: bold;
`

const TypeAliasBody = css`
	font-family: var(--monospace-font);
`
