import * as React from 'react'

import { ObjectTypeReflection, ReflectionKind } from '@tygen/reflector'
import { BaseView } from '../../view'
import { IndexSignaturesPre } from '../index-signatures'
import { ReflectionPre } from '..'
import { getKey } from '../../ref-link'
import { CallSignaturesPre } from '../call-signatures'

export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{'{'}
				<IndexSignaturesPre key="index" reflection={reflection} />
				<CallSignaturesPre key="call" callSignatures={reflection.callSignatures} />
				{reflection.properties &&
					reflection.properties.map((prop, i) => {
						return <ReflectionPre key={getKey(prop.id) || i} reflection={prop} />
					})}
				{'}'}
			</React.Fragment>
		)
	}
}
