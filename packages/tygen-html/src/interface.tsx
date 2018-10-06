import * as React from 'react'
import { InterfaceReflection, ClassReflection } from '@tygen/reflector'
import { Page } from './ui/layout'
import { BaseView } from './view'

import { Outline } from './ui/outline'
import { InterfacePre } from './pre/interface'
import { Pretty } from './pre/prettier'

export class InterfacePage extends BaseView<InterfaceReflection | ClassReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page reflection={reflection} header={<Outline header={<h1>{reflection.name}</h1>} />}>
				<Pretty>
					<InterfacePre reflection={reflection} />
				</Pretty>
			</Page>
		)

		// const { reflection, settings } = this.props
		// const { nav } = settings!
		// const ident = parseId(reflection.id!)
		// const sections = [] as React.ReactNode[]
		// if (reflection.kind === ReflectionKind.Interface) {
		// 	sections.push(
		// 		<SignaturesPre
		// 			key="sections"
		// 			signatures={reflection.allCallSignatures}
		// 			heading="Call signatures"
		// 		/>
		// 	)
		// }
		// sections.push(
		// 	<PropertiesViewPre
		// 		key="properties"
		// 		properties={reflection.allProperties}
		// 		parentId={reflection.id}
		// 	/>
		// )
		// if (reflection.exports) {
		// 	sections.push(<ExportsView key="exports" reflection={reflection} />)
		// }
		// if (nav) {
		// 	return <Nav>{sections}</Nav>
		// } else {
		// 	return (
		// 		<div>
		// 			<Header pkg={ident.pkg} version={ident.version} />
		// 			<Layout
		// 				sidebar={
		// 					<ViewContext.Provider
		// 						value={Object.assign({}, settings, { nav: true })}>
		// 						<InterfacePage reflection={reflection} />
		// 					</ViewContext.Provider>
		// 				}>
		// 				<h1>
		// 					{reflection.name}
		// 					{reflection.typeParameters && (
		// 						<TypeArgumentsPre types={reflection.typeParameters} />
		// 					)}{' '}
		// 					<Badge>
		// 						{reflection.kind === ReflectionKind.Interface
		// 							? 'Interface'
		// 							: 'Class'}
		// 					</Badge>
		// 				</h1>
		// 				<Breadcrumb reflection={reflection} />
		// 				<BaseTypes types={reflection.baseTypes} />
		// 				{reflection.kind === ReflectionKind.Class && (
		// 					<BaseTypes title="Implements" types={reflection.implements} />
		// 				)}
		// 				<CommentView reflection={reflection} />
		// 				{sections}
		// 			</Layout>
		// 		</div>
		// 	)
		// }
	}
}
