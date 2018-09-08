import * as React from 'react'
import { css } from 'linaria'

import { BaseView } from '../view'
import { ESSymbolReflection } from '@tygen/reflector/src/reflection/_type/symbol/reflection'

export class ESSymbolView extends BaseView<ESSymbolReflection> {
	render() {
		return <span className={ESSymbolBody}>symbol</span>
	}
}

const ESSymbolBody = css``
