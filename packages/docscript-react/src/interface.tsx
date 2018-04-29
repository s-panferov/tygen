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
import { TypeArguments } from './type-parameters'
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
				navigation.push(<NavSection key="index" heading="Index" />)
			} else {
				sections.push(
					<Section key="index" heading={<h2>Index Signatures</h2>}>
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

		if (reflection.constructSignatures) {
			if (nav) {
				navigation.push(<NavSection key="construct" heading="Construct Signatures" />)
			} else {
				sections.push(
					<Section key="call" heading={<h2>Construct Signatures</h2>}>
						{reflection.constructSignatures.map((sig, i) => (
							<ReflectionView reflection={sig} key={sig.id || i} />
						))}
					</Section>
				)
			}
		}

		if (reflection.allCallSignatures) {
			if (nav) {
				navigation.push(<NavSection key="call" heading="Call Signatures" />)
			} else {
				sections.push(
					<Section key="call" heading={<h2>Call Signatures</h2>}>
						{reflection.allCallSignatures.map((sig, i) => (
							<ReflectionView reflection={sig} key={sig.id || i} />
						))}
					</Section>
				)
			}
		}

		if (reflection.ownProperties) {
			const properties = reflection.ownProperties.map(prop => {
				return <ReflectionView key={prop.id} reflection={prop} nav={nav} />
			})

			if (nav) {
				navigation.push(
					<NavSection key="props" heading="Properties">
						{properties}
					</NavSection>
				)
			} else {
				sections.push(
					<Section key="props" heading={<h2>Properties</h2>}>
						{properties}
					</Section>
				)
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
								<TypeArguments types={reflection.typeParameters} />
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
