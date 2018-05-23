import * as React from 'react'
import * as ReactDOM from 'react-dom'
import path from 'path'

import { PageView } from './render'
const url = path.join(window.location.pathname, 'index.json')

fetch(url)
	.then(res => res.json())
	.then(refl => {
		ReactDOM.hydrate(
			<PageView reflection={refl} settings={(window as any).__argv} />,
			document.querySelector('#react-app')
		)
	})
	.catch(e => console.error(e))
