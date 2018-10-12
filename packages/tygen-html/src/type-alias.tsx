import * as React from 'react'

import { TypeAliasReflection } from '@tygen/reflector'

import { BaseView } from './view'
import { Page } from './ui/layout'
import { Pretty } from './pre/prettier'
import { Outline } from './ui/outline'
import { TypeAliasPre } from './pre/type-alias'

export class TypeAliasPage extends BaseView<TypeAliasReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page reflection={reflection} header={<Outline header={<h1>{reflection.name}</h1>} />}>
				<Pretty>
					<TypeAliasPre reflection={reflection} />
				</Pretty>
			</Page>
		)
	}
}
