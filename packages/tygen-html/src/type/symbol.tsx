import * as React from 'react'
import { css, styles } from 'linaria'

import { BaseView } from '../view'
import { ESSymbolReflection } from '@tygen/reflector/src/reflection/_type/symbol/reflection'

export class ESSymbolView extends BaseView<ESSymbolReflection> {
	render() {
		return <span {...styles(ESSymbolBody)}>symbol</span>
	}
}

const ESSymbolBody = css``
