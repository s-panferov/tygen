import * as React from 'react'
import { InterfaceReflection } from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { ReflectionView } from './view'
import { CommentView } from './comment'
import { PropertyView } from './property'
import { Section } from './ui/section'

export class InterfaceView extends ReflectionView<InterfaceReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const sections = (
			<Section heading={<h2>Properties</h2>}>
				{reflection.ownProperties &&
					reflection.ownProperties.map(prop => {
						return <PropertyView key={prop.id} reflection={prop} />
					})}
			</Section>
		)

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={1}>
					<h1>
						{reflection.name} <Badge>Interface</Badge>
					</h1>
					<CommentView reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}
