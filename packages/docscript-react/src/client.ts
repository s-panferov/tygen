import * as ReactDOM from 'react-dom'

import { renderPage } from './render'
const url = window.location.pathname

fetch(`${url}/index.json`)
	.then(res => res.json())
	.then(refl => {
		ReactDOM.hydrate(renderPage(refl), document.querySelector('#react-app'))
	})
	.catch(e => console.error(e))
