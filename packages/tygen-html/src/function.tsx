import * as React from 'react'
import { FunctionReflection } from '@tygen/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView } from './view'
import { Section } from './ui/section'
import { Breadcrumb } from './breadcrumb'
import { ReflectionView } from './render'
import { ExportsView } from './exports'

export class FunctionPage extends BaseView<FunctionReflection> {
	render() {
		const { reflection } = this.props
		const ident = parseId(reflection.id!)

		const sections = [] as React.ReactNode[]

		if (reflection.allCallSignatures) {
			sections.push(
				<Section key="call" heading={<h2>Call Signatures</h2>}>
					{reflection.allCallSignatures.map((sig, i) => (
						<ReflectionView key={sig.id || i} reflection={sig} />
					))}
				</Section>
			)
		}

		if (reflection.exports) {
			sections.push(<ExportsView key="exports" reflection={reflection} />)
		}

		return (
			<div>
				<Toolbar pkg={ident.pkg} version={ident.version} />
				<Layout sidebar={<span />}>
					<h1>
						{reflection.name} <Badge>Function</Badge>
					</h1>
					<Breadcrumb reflection={reflection} />
					{sections}
				</Layout>
			</div>
		)
	}
}
