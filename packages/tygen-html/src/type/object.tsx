import * as React from 'react'
import { css } from 'linaria'

import { BaseView, ViewContext, withContext } from '../view'
import { ObjectTypeReflection } from '@tygen/reflector/src/reflection/_type/object/reflection'
import { PropertiesView } from '../properties'
import { SignaturesView } from '../signatures'
import { IndexSignaturesView } from '../index-signatures'

@withContext
export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection, settings } = this.props
		return (
			<span className={ObjectBody}>
				{'{'}
				<div className={ObjectInternal}>
					<ViewContext.Provider value={Object.assign({}, settings, { compact: true })}>
						<IndexSignaturesView key="index" reflection={reflection} />
						<PropertiesView key="props" properties={reflection.allProperties} />
						<SignaturesView key="call" signatures={reflection.allCallSignatures} />
					</ViewContext.Provider>
				</div>
				{'}'}
			</span>
		)
	}
}

const ObjectBody = css``

const ObjectInternal = css`
	margin-left: 20px;
	padding: 5px;
`
