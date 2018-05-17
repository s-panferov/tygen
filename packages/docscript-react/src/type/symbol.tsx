import * as React from 'react'
import styled from 'styled-components'

import { BaseView } from '../view'
import { ESSymbolReflection } from '@docscript/reflector/src/reflection/_type/symbol/reflection'

export class ESSymbolView extends BaseView<ESSymbolReflection> {
	render() {
		return <ESSymbolBody>symbol</ESSymbolBody>
	}
}

const ESSymbolBody = styled.span``
