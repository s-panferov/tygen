import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { ObjectTypeReflection } from '@docscript/reflector/src/reflection/_type/object/reflection'
import { TypeView } from '../type'

export class ObjectView extends BaseView<ObjectTypeReflection> {
	render() {
		const { reflection } = this.props
		return <ObjectBody />
	}
}

const ObjectBody = styled.span``
