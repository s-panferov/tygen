import * as React from 'react'

import { BaseView } from './view'
import { VariableReflection } from '@tygen/reflector'
import { Page } from './ui/layout'
import { Pretty } from './pre/prettier'
import { VariablePre } from './pre/variable'
import { Outline } from './ui/outline'

export class VariablePage extends BaseView<VariableReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={<Outline header={<h1>Variable {reflection.name}</h1>} />}>
				<Pretty>
					<VariablePre reflection={reflection} />
				</Pretty>
			</Page>
		)
	}
}
