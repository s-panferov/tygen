import * as React from 'react'
import { InterfaceReflection, ClassReflection, ReflectionKind } from '@tygen/reflector'
import { Page } from './ui/layout'
import { BaseView } from './view'

import { Outline } from './ui/outline'
import { InterfacePre } from './pre/interface'
import { Pretty } from './pre/prettier'

export class InterfacePage extends BaseView<InterfaceReflection | ClassReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={
					<Outline
						header={
							<h1>
								{reflection.kind === ReflectionKind.Class ? 'Class' : 'Interface'}{' '}
								{reflection.name}
							</h1>
						}
					/>
				}>
				<Pretty>
					<InterfacePre reflection={reflection} />
				</Pretty>
			</Page>
		)
	}
}
