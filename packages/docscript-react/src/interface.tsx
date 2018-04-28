import * as React from 'react'
import { InterfaceReflection } from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView } from './view'
import { CommentView } from './comment'
import { Section } from './ui/section'
import { Breadcrumb } from './breadcrumb'
import { TypeParameters } from './type-parameters'
import { ReflectionView } from './render'
import { TypeView } from './type'
import { Nav, NavSection } from './ui/nav'

export class InterfacePage extends BaseView<InterfaceReflection> {
	render() {
		const { reflection, nav } = this.props
		const ident = parseId(reflection.id!)

		const sections = [] as React.ReactNode[]
		const navigation = [] as React.ReactNode[]

		if (reflection.numberIndexType || reflection.stringIndexType) {
			if (nav) {
				navigation.push(<NavSection heading="Index" />)
			} else {
				sections.push(
					<Section heading={<h2>Index Signatures</h2>}>
						{reflection.stringIndexType && (
							<span>
								String: <TypeView reflection={reflection.stringIndexType} />
							</span>
						)}
						{reflection.numberIndexType && (
							<span>
								Number: <TypeView reflection={reflection.numberIndexType} />
							</span>
						)}
					</Section>
				)
			}
		}

		if (reflection.allCallSignatures) {
			if (nav) {
				navigation.push(<NavSection heading="Call" />)
			} else {
				sections.push(
					<Section heading={<h2>Call Signatures</h2>}>
						{reflection.allCallSignatures.map((sig, i) => (
							<ReflectionView reflection={sig} key={sig.id || i} />
						))}
					</Section>
				)
			}
		}

		if (reflection.ownProperties) {
			const properties = reflection.ownProperties.map(prop => {
				return <ReflectionView reflection={prop} key={prop.id} nav={nav} />
			})

			if (nav) {
				navigation.push(<NavSection heading="Properties">{properties}</NavSection>)
			} else {
				sections.push(<Section heading={<h2>Properties</h2>}>{properties}</Section>)
			}
		}

		if (nav) {
			return <Nav>{navigation}</Nav>
		} else {
			return (
				<div>
					<Toolbar pkg={ident.pkg} version={ident.version} />
					<Layout sidebar={<InterfacePage reflection={reflection} nav />}>
						<h1>
							{reflection.name}
							{reflection.typeParameters && (
								<TypeParameters typeParameters={reflection.typeParameters} />
							)}{' '}
							<Badge>Interface</Badge>
						</h1>
						<Breadcrumb reflection={reflection} />
						<CommentView reflection={reflection} />
						{sections}
					</Layout>
				</div>
			)
		}
	}
}
