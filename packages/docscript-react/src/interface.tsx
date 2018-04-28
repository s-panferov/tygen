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

export class InterfacePage extends BaseView<InterfaceReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const sections = [] as React.ReactNode[]

		if (reflection.numberIndexType || reflection.stringIndexType) {
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

		if (reflection.allCallSignatures) {
			sections.push(
				<Section heading={<h2>Call Signatures</h2>}>
					{reflection.allCallSignatures.map((sig, i) => (
						<ReflectionView reflection={sig} key={sig.id || i} />
					))}
				</Section>
			)
		}

		if (reflection.ownProperties) {
			sections.push(
				<Section heading={<h2>Properties</h2>}>
					{reflection.ownProperties.map(prop => (
						<ReflectionView reflection={prop} key={prop.id} />
					))}
				</Section>
			)
		}

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={1}>
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
