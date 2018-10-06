import * as React from 'react'

import { ObjectTypeReflection } from '@tygen/reflector'
import { BaseView, ViewContext, withSettings } from '../../view'
import { PropertiesViewPre } from '../../properties'
import { SignaturesPre } from '../../signatures'
import { IndexSignaturesPre } from '../index-signatures'

@withSettings
export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection, settings } = this.props
		return (
			<React.Fragment>
				{'{'}
				<ViewContext.Provider value={Object.assign({}, settings, { compact: true })}>
					<IndexSignaturesPre key="index" reflection={reflection} />
					<PropertiesViewPre key="props" properties={reflection.allProperties} />
					<SignaturesPre key="call" signatures={reflection.allCallSignatures} />
				</ViewContext.Provider>
				{'}'}
			</React.Fragment>
		)
	}
}
