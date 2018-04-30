import * as React from 'react'
import styled from 'styled-components'

import { BaseView, ViewContext } from '../view'
import { ObjectTypeReflection } from '@docscript/reflector/src/reflection/_type/object/reflection'
import { PropertiesView } from '../properties'
import { SignaturesView } from '../signatures'
import { IndexSignaturesView } from '../index-signatures'

export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection, settings } = this.props
		return (
			<ObjectBody>
				{'{'}
				<ObjectInternal>
					<ViewContext.Provider value={Object.assign({}, settings, { compact: true })}>
						<IndexSignaturesView key="index" reflection={reflection} />
						<PropertiesView key="props" properties={reflection.allProperties} />
						<SignaturesView key="call" signatures={reflection.allCallSignatures} />
					</ViewContext.Provider>
				</ObjectInternal>
				{'}'}
			</ObjectBody>
		)
	}
}

const ObjectBody = styled.span``
const ObjectInternal = styled.div`
	margin-left: 20px;
	padding: 5px;
`
