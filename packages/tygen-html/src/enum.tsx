import * as React from 'react'

import { EnumReflection } from '@tygen/reflector'

import { BaseView } from './view'
import { Page } from './ui/layout'
import { Pretty } from './pre/prettier'
import { Outline } from './ui/outline'
import { EnumPre } from './pre/enum'

export class EnumPage extends BaseView<EnumReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={<Outline header={<h1>Enum {reflection.name}</h1>} />}>
				<Pretty>
					<EnumPre reflection={reflection} />
				</Pretty>
			</Page>
		)
	}
}
