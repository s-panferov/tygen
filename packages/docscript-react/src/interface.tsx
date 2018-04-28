import * as React from 'react'
import { InterfaceReflection, ReflectionKind } from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView } from './view'
import { CommentView } from './comment'
import { PropertyView } from './property'
import { Section } from './ui/section'
import { MethodView } from './method'

export class InterfaceView extends BaseView<InterfaceReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const sections = (
			<Section heading={<h2>Properties</h2>}>
				{reflection.ownProperties &&
					reflection.ownProperties.map(prop => {
						switch (prop.kind) {
							case ReflectionKind.Property:
								return <PropertyView key={prop.id} reflection={prop} />
							case ReflectionKind.Method:
								return <MethodView key={prop.id} reflection={prop} />
						}
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
