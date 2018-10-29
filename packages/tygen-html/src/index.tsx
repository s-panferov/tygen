import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { PageView } from './render'

import './theme/body'

if (typeof window !== 'undefined') {
	ReactDOM.hydrate(
		<PageView reflection={(window as any).__ref} settings={(window as any).__argv} />,
		document.querySelector('#react-app')
	)
}
