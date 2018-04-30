import * as React from 'react'
import {
	InterfaceReflection,
	ClassReflection,
	ReflectionKind
} from '@docscript/reflector/src/reflection'
import { Toolbar } from './ui/toolbar'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView, withContext, ViewContext } from './view'
import { CommentView } from './comment'
import { Breadcrumb } from './breadcrumb'
import { TypeArguments } from './type-parameters'
import { Nav } from './ui/nav'
import { PropertiesView } from './properties'
import { SignaturesView } from './signatures'
import { IndexSignaturesView } from './index-signatures'

@withContext
export class InterfacePage extends BaseView<InterfaceReflection | ClassReflection> {
	render() {
		const { reflection, settings } = this.props
		const { nav } = settings!

		const ident = parseId(reflection.id!)
		const sections = [] as React.ReactNode[]

		sections.push(<IndexSignaturesView key="index" reflection={reflection} />)

		sections.push(
			<SignaturesView
				key="construct"
				signatures={reflection.constructSignatures}
				heading="Construct signatures"
			/>
		)

		if (reflection.kind === ReflectionKind.Interface) {
			sections.push(
				<SignaturesView
					key="sections"
					signatures={reflection.allCallSignatures}
					heading="Call signatures"
				/>
			)
		}

		sections.push(<PropertiesView key="properties" properties={reflection.allProperties} />)

		if (nav) {
			return <Nav>{sections}</Nav>
		} else {
			return (
				<div>
					<Toolbar pkg={ident.pkg} version={ident.version} />
					<Layout
						sidebar={
							<ViewContext.Provider
								value={Object.assign({}, settings, { nav: true })}>
								<InterfacePage reflection={reflection} />
							</ViewContext.Provider>
						}>
						<h1>
							{reflection.name}
							{reflection.typeParameters && (
								<TypeArguments types={reflection.typeParameters} />
							)}{' '}
							<Badge>
								{reflection.kind === ReflectionKind.Interface
									? 'Interface'
									: 'Class'}
							</Badge>
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
