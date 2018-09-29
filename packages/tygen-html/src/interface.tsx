import * as React from 'react'
import {
	InterfaceReflection,
	ClassReflection,
	ReflectionKind
} from '@tygen/reflector/src/reflection'
import { Header } from './ui/header'
import { parseId } from './helpers'
import { Layout } from './ui/layout'
import { Badge } from './ui/badge'
import { BaseView, withSettings, ViewContext } from './view'
import { CommentView } from './comment'
import { Breadcrumb } from './breadcrumb'
import { TypeArgumentsPre } from './type-parameters'
import { Nav } from './ui/nav'
import { PropertiesViewPre } from './properties'
import { SignaturesPre } from './signatures'
import { IndexSignaturesPre } from './pre/index-signatures'
import { ExportsView } from './exports'
import { BaseTypes } from './base-types'

@withSettings
export class InterfacePage extends BaseView<InterfaceReflection | ClassReflection> {
	render() {
		const { reflection, settings } = this.props
		const { nav } = settings!

		const ident = parseId(reflection.id!)
		const sections = [] as React.ReactNode[]

		sections.push(<IndexSignaturesPre key="index" reflection={reflection} />)

		sections.push(
			<SignaturesPre
				key="construct"
				signatures={reflection.constructSignatures}
				heading="Construct signatures"
			/>
		)

		if (reflection.kind === ReflectionKind.Interface) {
			sections.push(
				<SignaturesPre
					key="sections"
					signatures={reflection.allCallSignatures}
					heading="Call signatures"
				/>
			)
		}

		sections.push(
			<PropertiesViewPre
				key="properties"
				properties={reflection.allProperties}
				parentId={reflection.id}
			/>
		)

		if (reflection.exports) {
			sections.push(<ExportsView key="exports" reflection={reflection} />)
		}

		if (nav) {
			return <Nav>{sections}</Nav>
		} else {
			return (
				<div>
					<Header pkg={ident.pkg} version={ident.version} />
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
								<TypeArgumentsPre types={reflection.typeParameters} />
							)}{' '}
							<Badge>
								{reflection.kind === ReflectionKind.Interface
									? 'Interface'
									: 'Class'}
							</Badge>
						</h1>
						<Breadcrumb reflection={reflection} />
						<BaseTypes types={reflection.baseTypes} />
						{reflection.kind === ReflectionKind.Class && (
							<BaseTypes title="Implements" types={reflection.implements} />
						)}
						<CommentView reflection={reflection} />
						{sections}
					</Layout>
				</div>
			)
		}
	}
}
