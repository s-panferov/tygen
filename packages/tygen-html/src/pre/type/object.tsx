import * as React from 'react'

import { ObjectTypeReflection } from '@tygen/reflector'
import { BaseView, ViewContext } from '../../view'
import { IndexSignaturesPre } from '../index-signatures'

export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection, settings } = this.props
		return (
			<React.Fragment>
				{'{'}
				<ViewContext.Provider value={Object.assign({}, settings, { compact: true })}>
					<IndexSignaturesPre key="index" reflection={reflection} />
				</ViewContext.Provider>
				{'}'}
			</React.Fragment>
		)
	}
}
