import * as React from 'react'

import { ObjectTypeReflection } from '@tygen/reflector'
import { BaseView } from '../../view'
import { IndexSignaturesPre } from '../index-signatures'
import { ReflectionPre } from '..'
import { getKey } from '../../ref-link'

export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection } = this.props
		return (
			<React.Fragment>
				{'{'}
				<IndexSignaturesPre key="index" reflection={reflection} />
				{reflection.allProperties &&
					reflection.allProperties.map((prop, i) => {
						return <ReflectionPre key={getKey(prop.id) || i} reflection={prop} />
					})}
				{'}'}
			</React.Fragment>
		)
	}
}
