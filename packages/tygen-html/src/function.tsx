import * as React from 'react'

import { FunctionReflection } from '@tygen/reflector'

import { BaseView } from './view'
import { Page } from './ui/layout'
import { Pretty } from './pre/prettier'
import { Outline } from './ui/outline'
import { FunctionPre } from './pre/function'

export class FunctionPage extends BaseView<FunctionReflection> {
	render() {
		const { reflection } = this.props

		return (
			<Page
				reflection={reflection}
				header={<Outline header={<h1>Function {reflection.name}</h1>} />}>
				<Pretty>
					<FunctionPre reflection={reflection} />
				</Pretty>
			</Page>
		)
	}
}
